import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { Util } from '../shared/util';

import { GenotypeDetails, PombaseAPIService, APIError } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig, AppConfig, getAppConfig } from '../config';


@Component({
  selector: 'app-genotype-details',
  templateUrl: './genotype-details.component.html',
  styleUrls: ['./genotype-details.component.css']
})
export class GenotypeDetailsComponent implements OnInit {
  @Input() genotypeDetails: GenotypeDetails;

  annotationTypeNames: Array<string> = [];
  config: AnnotationTableConfig = getAnnotationTableConfig();
  displayAlleles: Array<any> = [];
  displayName = '';
  displayNameForTitle = '';
  apiError?: APIError;
  appConfig: AppConfig = getAppConfig();
  isDiploid = false;

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
              private readonly meta: Meta) { }

  displayNameLong(): string {
    return Util.displayNameLong(this.genotypeDetails);
  }

  setDisplayName(): void {
    const displayName = this.displayNameLong();
    this.displayNameForTitle = displayName;
    this.displayName = displayName.replace(/,/g, ',&thinsp;');

    if (this.displayNameForTitle.length > 105) {
      this.displayNameForTitle = this.displayNameForTitle.substr(0, 100) + ' ...';
    }
  }

  setPageTitle(): void {
    const title = this.appConfig.site_name + ' - Genotype - ' +
      this.displayNameForTitle;
    this.titleService.setTitle(title);
    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({property: 'description', content: title});
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['uniquename'] !== undefined) {
        let uniquename = params['uniquename'];
        this.pombaseApiService.getGenotype(uniquename)
          .then(genotypeDetails => {
            this.genotypeDetails = genotypeDetails;
            this.setDisplayName();
            this.annotationTypeNames = this.config.annotationTypeOrder;
            this.setPageTitle();
            this.apiError = undefined;
            this.isDiploid = false;
            for (let locus of genotypeDetails.loci) {
              if (locus.expressed_alleles.length > 1) {
                this.isDiploid = true;
                break;
              }
            }
          })
          .catch(error => {
            this.apiError = error;
          });
      };
    });
  }
}
