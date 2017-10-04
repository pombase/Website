import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsComponent } from './docs/docs.component';

import { SharedModule } from '../shared/shared.module';

import { routing } from './documentation.routing';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    routing,
  ],
  declarations: [
    DocsComponent,
  ]
})
export class DocumentationModule { }
