import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';
import { GeneQuery, QueryResult, QueryOutputOptions } from './pombase-query';
import { getAppConfig, getReleaseConfig } from './config';

function makeResults(resultsObject: any): QueryResult {
  return new QueryResult('OK', resultsObject.rows);
}

const localStorageKey = 'pombase-query-build-history-v1';

export class HistoryEntry {
  checked = false;

  constructor(private query: GeneQuery, private resultCount: number) {};

  getQuery(): GeneQuery {
    return this.query;
  }

  getResultCount(): number {
    return this.resultCount;
  }

  toObject(): Object {
    let o = this.query.toObject();
    o.resultCount = this.resultCount;
    return o;
  }
}

@Injectable()
export class QueryService {
  private apiUrl = getReleaseConfig().baseUrl + '/api/v1/dataset/latest';

  private history: Array<HistoryEntry> = [];
  private subject: Subject<Array<HistoryEntry>> = new Subject();

  constructor(private http: Http) {
    try {
      let savedHistoryString = localStorage.getItem(localStorageKey);
      if (savedHistoryString) {
        this.history = [];

        for (let o of JSON.parse(savedHistoryString)) {
          try {
            const query = new GeneQuery(o.constraints);
            const entry = new HistoryEntry(query, o.resultCount);
            this.history.push(entry);
          } catch (e) {
            console.log('failed to deserialise: ' + JSON.stringify(o) + ' - ' + e.message);
          }
        };
      }
    } catch (e) {
      console.log('failed to deserialise history: ' + e.message);
    }
  }

  private postRaw(query: GeneQuery, outputOptions: QueryOutputOptions): Observable<Response> {
    const jsonString = query.toPostJSON(outputOptions);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.apiUrl + '/query', jsonString, options);
  }

  postQuery(query: GeneQuery, outputOptions: QueryOutputOptions): Observable<QueryResult> {
    return this.postRaw(query, outputOptions)
      .map((res) => { return makeResults(res.json()); });
  }
  postQueryCount(query: GeneQuery): Observable<number> {
    const outputOptions = new QueryOutputOptions([], 'none');
    return this.postRaw(query, outputOptions)
      .map((res) => { return res.json().rows.length; });
  }

  postPredefinedQuery(queryName: string, outputOptions: QueryOutputOptions): Observable<QueryResult> {
    const query = getAppConfig().getPredefinedQuery(queryName);
    return this.postQuery(query, outputOptions);
  }

  postPredefinedQueryCount(queryName: string): Observable<number> {
    const query = getAppConfig().getPredefinedQuery(queryName);
    return this.postQueryCount(query);
  }

  private saveHistory() {
    let historyObjects = this.history.map((e) => e.toObject());
    localStorage.setItem(localStorageKey, JSON.stringify(historyObjects));
  }

  private deleteExisting(query: GeneQuery) {
    this.history = this.history.filter(histEntry => {
      return !histEntry.getQuery().equals(query);
    });
  }

  saveToHistory(query: GeneQuery, resultCount: number) {
    this.deleteExisting(query);
    const entry = new HistoryEntry(query, resultCount);
    this.history.unshift(entry);
    this.subject.next(this.history);
    this.saveHistory();
  }

  getHistory(): Array<HistoryEntry> {
    return this.history;
  }

  getHistoryChanges(): Subject<Array<HistoryEntry>> {
    return this.subject;
  }

  removeFromHistory(...entries: Array<HistoryEntry>) {
    let removeQueries = entries.map(e => e.getQuery());
    this.history =
      this.history.filter((entry: HistoryEntry) => {
        return removeQueries.indexOf(entry.getQuery()) === -1;
      });
    this.subject.next(this.history);
    this.saveHistory();
  }
}
