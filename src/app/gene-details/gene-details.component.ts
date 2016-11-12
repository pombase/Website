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

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['uniquename'] !== undefined) {
        let uniquename = params['uniquename'];
        this.pombaseApiService.getGene(uniquename)
          .then(geneDetails => {
            this.annotationTypeNames = Object.keys(geneDetails.annotations);
            this.geneDetails = geneDetails;
            this.synonymsDisplay =
              geneDetails.synonyms.map((synonym) => {
                return synonym.name + " (" + synonym.synonym_type + ")";
              }).join(", ");
          });
      };
    });
  }
}
