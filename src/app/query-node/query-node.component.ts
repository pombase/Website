import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

import { GeneQuery, GeneListNode, TermNode, SubsetNode, IntRangeNode, FloatRangeNode,
         GenomeRangeNode, GeneQueryNode, TermShort } from '../pombase-query';
import { GeneSummary, ChromosomeShort } from '../pombase-api.service';

import { getAppConfig, QueryNodeConfig, QueryNodeSubsetConfig } from '../config';
import { PombaseAPIService } from '../pombase-api.service';
import { SubscriptionLike } from 'rxjs';


@Component({
  selector: 'app-query-node',
  templateUrl: './query-node.component.html',
  styleUrls: ['./query-node.component.css']
})
export class QueryNodeComponent implements OnInit, OnChanges {
  @Input() node: GeneQueryNode;
  @Input() startNodeType: string = null;
  @Output() nodeEvent = new EventEmitter<GeneQueryNode>();

  nodeTypes = getAppConfig().queryBuilder.nodeTypes;
  cannedQueryDetails: Array<{ name: string; queryId: string; }> = null;
  chromosomeSummaries: Array<ChromosomeShort> = null;

  activeConf: QueryNodeConfig = null;
  selectedTerm: TermShort = null;
  selectedSubset: QueryNodeSubsetConfig = null;
  subsetName = '';
  rangeStart: number = null;
  rangeEnd: number = null;
  chromosomeName: string = null;

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit() {
    this.cannedQueryDetails =
      getAppConfig().cannedQueryIds.map(id => {
        const queryId = 'canned_query:' + id;
        const query = new GeneQuery(getAppConfig().getPredefinedQuery(queryId));
        return {
          name: query.getName(),
          queryId: queryId,
        };
      });

    this.pombaseApiService.getChromosomeSummariesPromise()
      .then(chrSummaries => {
        this.chromosomeSummaries = chrSummaries;
      });
  }

  ngOnChanges() {
    if (this.startNodeType) {
      this.setNodeType(this.startNodeType);
    }
  }

  upperCaseIntial(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  removePrefix(s: string): string {
    let firstColon = s.indexOf(':');
    return s.slice(firstColon + 1);
  }

  clearQuery(): void {
    this.selectedTerm = null;
    this.selectedSubset = null;
    this.subsetName = '';
    this.rangeStart = null;
    this.rangeEnd = null;
    this.activeConf = null;
    // clear the current query and results
    this.nodeEvent.emit(null);
  }

  setNodeType(confId: string) {
    if (!this.activeConf || confId !== this.activeConf.id) {
      this.clearQuery();
      for (let conf of this.nodeTypes) {
        if (confId === conf.id) {
          this.activeConf = conf;
        }
      }
    }
  }

  newTermNode(newNode: TermNode) {
    this.selectedTerm = newNode.getTerm();
    this.nodeEvent.emit(newNode);
  }

  genesFound(genes: Array<GeneSummary>) {
    let part = new GeneListNode(genes);
    this.nodeEvent.emit(part);
  }

  smallOntologyChange(): void {
    if (this.selectedTerm) {
      let part = new TermNode(this.selectedTerm.termid, this.selectedTerm.name,
                              this.selectedTerm.definition, null, null);
      this.nodeEvent.emit(part);
    }
  }

  subsetChange(): void {
    if (this.selectedSubset) {
      let part = new SubsetNode(this.selectedSubset.name, this.selectedSubset.displayName);
      this.nodeEvent.emit(part);
    }
  }

  subsetInputSearch(): void {
    let trimmedSubsetName = this.subsetName.trim();
    if (trimmedSubsetName.length > 0) {
      let longName;
      if (this.activeConf.subsetPrefix) {
        longName = this.activeConf.subsetPrefix + ':' + trimmedSubsetName;
      } else {
        longName = trimmedSubsetName;
      }
      let part = new SubsetNode(longName, longName);
      this.nodeEvent.emit(part);
    }
  }

  validRange(): boolean {
    return (this.rangeStart !== null ||
            this.rangeEnd !== null) &&
      (this.rangeStart === null ||
       this.rangeEnd === null ||
       this.rangeStart <= this.rangeEnd);
  }

  intRangeSearch(): void {
    let part = new IntRangeNode(this.activeConf.id,
                                this.rangeStart, this.rangeEnd);
    this.nodeEvent.emit(part);
  }

  floatRangeSearch(): void {
    let part = new FloatRangeNode(this.activeConf.id,
                                  this.rangeStart, this.rangeEnd);
    this.nodeEvent.emit(part);
  }

  genomeRangeSearch(): void {
    if (this.chromosomeName) {
      const part = new GenomeRangeNode(this.rangeStart, this.rangeEnd,
                                       this.chromosomeName);
      this.nodeEvent.emit(part);
    }
  }

  genomeRangeButtonTitle(): string {
    if (this.chromosomeName) {
      if ((!this.rangeStart && !this.rangeEnd) || this.validRange()) {
        return 'Click to search';
      } else {
        return 'Start and end are optional but start must be less than end';
      }
    } else {
      return 'Select a chromosome';
    }
  }

  selectPredefinedQuery(predefinedQueryId: string): void {
    const queryJson = getAppConfig().getPredefinedQuery(predefinedQueryId);
    const query = new GeneQuery(queryJson);
    this.nodeEvent.emit(query.getTopNode());
  }
}