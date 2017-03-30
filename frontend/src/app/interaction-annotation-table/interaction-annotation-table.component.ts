import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { InteractionAnnotation, GeneShort } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';

@Component({
  selector: 'app-interaction-annotation-table',
  templateUrl: './interaction-annotation-table.component.html',
  styleUrls: ['./interaction-annotation-table.component.css']
})
export class InteractionAnnotationTableComponent implements OnInit, OnChanges {
  @Input() annotationTypeName: string;
  @Input() currentGene: GeneShort = null;
  @Input() hideColumns: Array<string> = [];
  @Input() annotationTable: Array<InteractionAnnotation>;

  config: AnnotationTableConfig = getAnnotationTableConfig();

  annotationTypeDisplayName = null;
  hideColumn = {};

  displayTable = [];

  constructor() { }

  ngOnInit() {
    this.hideColumns.map(col => {
      this.hideColumn[col] = true;
    });

    let typeConfig = this.config.annotationTypes[this.annotationTypeName];
    if (typeConfig && typeConfig.display_name) {
      this.annotationTypeDisplayName =
        this.config.annotationTypes[this.annotationTypeName].display_name;
    } else {
      this.annotationTypeDisplayName = this.annotationTypeName;
    }
  }

  ngOnChanges() {
    this.displayTable =
      this.annotationTable.map(
        (annotation) => {
          let displayAnnotation = {
            gene: annotation.gene,
            interactor: annotation.interactor,
            reference: annotation.reference,
            evidence: annotation.evidence,
            displayLabel: '',
          };

          let labelConfig = this.config.interactionDirectionalLabels[annotation.evidence];

          if (!labelConfig) {
            return displayAnnotation;
          }

          displayAnnotation.displayLabel = labelConfig.bait;

          if (this.currentGene) {
            if (this.currentGene.uniquename != annotation.gene.uniquename) {
              // current gene is the prey
              displayAnnotation.displayLabel = labelConfig.prey;
              [displayAnnotation.gene, displayAnnotation.interactor] =
                [displayAnnotation.interactor, displayAnnotation.gene];
            }
          }

          return displayAnnotation;
        });
  }
}
