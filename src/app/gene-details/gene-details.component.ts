import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { SynonymDetails, GeneDetails, PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-gene-details',
  templateUrl: './gene-details.component.html',
  styleUrls: ['./gene-details.component.css']
})
export class GeneDetailsComponent implements OnInit {
  @Input() geneDetails: GeneDetails;
  synonymsDisplay: string = "";
  annotationTypeNames: Array<string>;

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute) { }

  makeSynonymsDisplay(synonyms: Array<SynonymDetails>): string {
    return synonyms.map((synonym) => {
      if (synonym.synonym_type == 'exact') {
        return synonym.name;
      } else {
        let synonym_type = synonym.synonym_type;
        if (synonym_type == 'obsolete_name') {
          synonym_type = 'obsolete';
        }
        return synonym.name + " (" + synonym_type + ")";
      }
    }).join(", ");
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['uniquename'] !== undefined) {
        let uniquename = params['uniquename'];
        this.pombaseApiService.getGene(uniquename)
          .then(geneDetails => {
            this.annotationTypeNames = Object.keys(geneDetails.annotations);
            this.geneDetails = geneDetails;
            this.synonymsDisplay = this.makeSynonymsDisplay(geneDetails.synonyms);
          });
      };
    });
  }
}
