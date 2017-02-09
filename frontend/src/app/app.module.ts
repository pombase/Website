import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { TypeaheadModule } from 'ng2-bootstrap/ng2-bootstrap';
import { PaginationModule } from 'ng2-bootstrap/ng2-bootstrap';

import { AppComponent } from './app.component';
import { GeneDetailsComponent } from './gene-details/gene-details.component';
import { TermDetailsComponent } from './term-details/term-details.component';
import { FrontComponent } from './front/front.component';
import { PombaseAPIService } from './pombase-api.service';
import { AnnotationTableComponent } from './annotation-table/annotation-table.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { GetFocusDirective } from './get-focus.directive';
import { InteractionAnnotationTableComponent } from './interaction-annotation-table/interaction-annotation-table.component';
import { OrthologAnnotationTableComponent } from './ortholog-annotation-table/ortholog-annotation-table.component';
import { ParalogAnnotationTableComponent } from './paralog-annotation-table/paralog-annotation-table.component';
import { ReferenceShortComponent } from './reference-short/reference-short.component';
import { ReferenceDetailsComponent } from './reference-details/reference-details.component';
import { GeneLinkComponent } from './gene-link/gene-link.component';
import { ExtensionDisplayComponent } from './extension-display/extension-display.component';
import { GenotypeLinkComponent } from './genotype-link/genotype-link.component';
import { GenesTableComponent } from './genes-table/genes-table.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { TermNameCompleteComponent } from './term-name-complete/term-name-complete.component';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { QueryNodeComponent } from './query-node/query-node.component';
import { GeneResultsComponent } from './gene-results/gene-results.component';
import { GeneNeighbourhoodComponent } from './gene-neighbourhood/gene-neighbourhood.component';
import { AnnotationTableSummaryComponent } from './annotation-table-summary/annotation-table-summary.component';
import { AnnotationTableFullComponent } from './annotation-table-full/annotation-table-full.component';
import { AnnotationSubTableComponent } from './annotation-sub-table/annotation-sub-table.component';
import { TargetOfAnnotationTableComponent } from './target-of-annotation-table/target-of-annotation-table.component';
import { GeneReferencesTableComponent } from './gene-references-table/gene-references-table.component';
import { ReferenceOrderByPipe } from './reference-order-by.pipe';
import { GeneShortOrderByPipe } from './gene-short-order-by.pipe';
import { EvidenceLinkComponent } from './evidence-link/evidence-link.component';
import { QuantGeneExTableComponent } from './quant-gene-ex-table/quant-gene-ex-table.component';
import { QualGeneExTableComponent } from './qual-gene-ex-table/qual-gene-ex-table.component';
import { WithOrFromLinkComponent } from './with-or-from-link/with-or-from-link.component';
import { GenotypeDetailsComponent } from './genotype-details/genotype-details.component';

@NgModule({
  declarations: [
    AppComponent,
    GeneDetailsComponent,
    FrontComponent,
    TermDetailsComponent,
    AnnotationTableComponent,
    SearchBoxComponent,
    GetFocusDirective,
    InteractionAnnotationTableComponent,
    OrthologAnnotationTableComponent,
    ParalogAnnotationTableComponent,
    ReferenceShortComponent,
    ReferenceDetailsComponent,
    GeneLinkComponent,
    ExtensionDisplayComponent,
    GenotypeLinkComponent,
    GenesTableComponent,
    LoadingSpinnerComponent,
    TermNameCompleteComponent,
    QueryBuilderComponent,
    QueryNodeComponent,
    GeneResultsComponent,
    GeneNeighbourhoodComponent,
    AnnotationTableSummaryComponent,
    AnnotationTableFullComponent,
    AnnotationSubTableComponent,
    TargetOfAnnotationTableComponent,
    GeneReferencesTableComponent,
    ReferenceOrderByPipe,
    GeneShortOrderByPipe,
    EvidenceLinkComponent,
    QuantGeneExTableComponent,
    QualGeneExTableComponent,
    WithOrFromLinkComponent,
    GenotypeDetailsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    TypeaheadModule,
    PaginationModule,
  ],
  providers: [PombaseAPIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
