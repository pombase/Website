import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { PombaseAPIService, GeneSummary } from '../pombase-api.service';

import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';

interface Model extends GeneSummary {
  searchData: string;
}

class DisplayModel {
  constructor(public uniquename: string,
              public name: string,
              public otherDetails: string) { }
}

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  public fieldValue = '';
  dataSource: Observable<any>;
  noResults = true;

  lastMatchIdentifier = '';

  geneSummaries: Array<GeneSummary> = [];

  constructor(private pombaseApiService: PombaseAPIService,
              private router: Router) {
    this.dataSource = Observable
      .create((observer: any) => {
        // Runs on every search
        observer.next(this.fieldValue);
      })
      .mergeMap((token: string) => this.summariesAsObservable(token));
  }

  nameExactMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    if (geneSumm.name && geneSumm.name.toLowerCase() === value) {
      return new DisplayModel(geneSumm.uniquename, geneSumm.name, null);
    }
    return null;
  }

  nameMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    if (geneSumm.name && geneSumm.name.toLowerCase().indexOf(value) !== -1) {
      return new DisplayModel(geneSumm.uniquename, geneSumm.name, null);
    } else {
      return null;
    }
  }

  identifierMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    if (geneSumm.uniquename.toLowerCase().indexOf(value) !== -1) {
      return new DisplayModel(geneSumm.uniquename, geneSumm.name, null);
    } else {
      return null;
    }
  }

  synonymMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    for (let syn of geneSumm.synonyms) {
      if (syn.toLowerCase().indexOf(value) !== -1) {
        return new DisplayModel(geneSumm.uniquename, geneSumm.name, 'synonym: ' + syn);
      }
    }
    return null;
  }

  synonymExactMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    for (let syn of geneSumm.synonyms) {
      if (syn.toLowerCase() === value) {
        return new DisplayModel(geneSumm.uniquename, geneSumm.name, 'synonym: ' + syn);
      }
    }
    return null;
  }

  orthologMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    for (let orth of geneSumm.orthologs) {
      if (orth.identifier.toLowerCase().indexOf(value) !== -1) {
        return new DisplayModel(geneSumm.uniquename, geneSumm.name,
                                'ortholog: ' + orth.identifier);
      }
    }
    return null;
  }

  orthologExactMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    for (let orth of geneSumm.orthologs) {
      if (orth.identifier.toLowerCase() === value) {
        return new DisplayModel(geneSumm.uniquename, geneSumm.name,
                                'ortholog: ' + orth.identifier);
      }
    }
    return null;
  }

  productMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    if (geneSumm.product && geneSumm.product.toLowerCase().indexOf(value) !== -1) {
      return new DisplayModel(geneSumm.uniquename, geneSumm.name,
                              'product: ' + geneSumm.product);
    } else {
      return null;
    }
  }

  uniprotIdMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    if (geneSumm.uniprot_identifier && geneSumm.uniprot_identifier.toLowerCase().indexOf(value) !== -1) {
      return new DisplayModel(geneSumm.uniquename, geneSumm.name,
                              'UniProt ID: ' + geneSumm.uniprot_identifier);
    } else {
      return null;
    }
  }

  containsMatch(matches: Array<DisplayModel>, match: DisplayModel): boolean {
    return matches.findIndex((element) => element.uniquename === match.uniquename) !== -1;
  }

  summariesAsObservable(fieldValue: string): Observable<any> {
    if (this.geneSummaries) {
      let value = this.fieldValue.trim().toLowerCase();

      if (value.length > 0) {
        let filteredSummaries = [];
        for (let geneSumm of this.geneSummaries) {
          let match = this.nameExactMatch(geneSumm, value);
          if (match) {
            console.log("nameExactMatch() match: " + JSON.stringify(match));
            filteredSummaries.push(match);
          }
        }
        for (let geneSumm of this.geneSummaries) {
          let match = this.synonymExactMatch(geneSumm, value);
          if (match) {
            console.log("synonymExactMatch() match: " + JSON.stringify(match));
            filteredSummaries.push(match);
          }
        }
        for (let geneSumm of this.geneSummaries) {
          let match = this.orthologExactMatch(geneSumm, value);
          if (match) {
            console.log("orth match: " + JSON.stringify(match));
            filteredSummaries.push(match);
          }
        }
        for (let geneSumm of this.geneSummaries) {
          let match = this.nameMatch(geneSumm, value);
          if (match && filteredSummaries.length < 20 &&
              !this.containsMatch(filteredSummaries, match)) {
            filteredSummaries.push(match);
          }
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.geneSummaries) {
            let match = this.identifierMatch(geneSumm, value);
            if (match && filteredSummaries.length < 20) {
              filteredSummaries.push(match);
            }
          }
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.geneSummaries) {
            let match = this.synonymMatch(geneSumm, value);
            if (match && filteredSummaries.length < 20 &&
                !this.containsMatch(filteredSummaries, match)) {
              filteredSummaries.push(match);
            }
          }
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.geneSummaries) {
            let match = this.orthologMatch(geneSumm, value);
            if (match && filteredSummaries.length < 20 &&
                !this.containsMatch(filteredSummaries, match)) {
              filteredSummaries.push(match);
            }
          }
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.geneSummaries) {
            let match = this.productMatch(geneSumm, value);
            if (match && filteredSummaries.length < 20 &&
                !this.containsMatch(filteredSummaries, match)) {
              filteredSummaries.push(match);
            }
          }
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.geneSummaries) {
            let match = this.uniprotIdMatch(geneSumm, value);
            if (match && filteredSummaries.length < 20 &&
                !this.containsMatch(filteredSummaries, match)) {
              filteredSummaries.push(match);
            }
          }
        }
        return Observable.of(filteredSummaries);
      } else {
        return Observable.of([]);
      }
    } else {
      return Observable.of([]);
    }
  }

  ngOnInit() {
    this.pombaseApiService.getGeneSummaries()
      .then(summaries => {
        this.geneSummaries = summaries;

        let summaryCmp =
          (a, b) => {
            if (a.name) {
              if (b.name) {
                return a.name.localeCompare(b.name);
              } else {
                return -1;
              }
            } else {
              if (b.name) {
                return 1;
              } else {
                return a.uniquename.localeCompare(b.uniquename);
              }
            }
          };

        this.geneSummaries.sort(summaryCmp);
      });
  }

  public typeaheadOnSelect(e: TypeaheadMatch): void {
    this.router.navigate(['/gene', e.item.uniquename]);
    this.fieldValue = '';
  }

  public typeaheadNoResults(e: boolean) {
    this.noResults = e;
  }

  matchesReference(value: string): boolean {
    return value.match(/^\s*(?:(PMID|GO_REF):)?\d\d\d+\s*$/) != null;
  }

  matchesTerm(value: string): boolean {
    return value.match(/^\s*[a-zA-Z_]+:\d\d\d+\s*$/) != null;
  }

  enterPressed(e: any) {
    let trimmedValue = this.fieldValue.trim();
    if (this.matchesReference(trimmedValue)) {
      let pmid = this.fieldValue;
      if (!pmid.startsWith('PMID:')) {
        pmid = 'PMID:' + pmid;
      }
      this.fieldValue = '';
      this.router.navigate(['/reference', pmid]);
    } else {
      if (this.matchesTerm(trimmedValue)) {
        this.fieldValue = '';
        this.router.navigate(['/term', trimmedValue]);
      }
    }
  }

  getVisibility(): string {
    if (this.noResults && this.fieldValue.length > 0) {
      return 'visible';
    } else {
      return 'hidden';
    }
  }
}
