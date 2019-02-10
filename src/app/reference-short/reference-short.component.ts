import { Component, Input, OnInit } from '@angular/core';

import { ReferenceShort } from '../pombase-api.service';
import { getXrf } from '../config';

@Component({
  selector: 'app-reference-short',
  templateUrl: './reference-short.component.html',
  styleUrls: ['./reference-short.component.css']
})
export class ReferenceShortComponent implements OnInit {
  @Input() reference: ReferenceShort;
  @Input() showRefTitle = false;
  @Input() linkText?: string;

  displayString = '';
  refTitle = '';
  popoverContents: string[] = [];
  xref: string = null;
  isPMID = false;

  constructor() { }

  ngOnInit() {
    let xrfDetail = getXrf(this.reference.uniquename);

    if (xrfDetail) {
      this.xref = xrfDetail.url;
      if (this.linkText) {
        this.displayString = this.linkText;
      } else {
        this.displayString = this.reference.uniquename;
      }
    } else {
      if (this.reference.authors_abbrev) {
        this.displayString = this.reference.authors_abbrev;
      } else {
        this.displayString = this.reference.uniquename;
      }
      if (this.reference.publication_year) {
        this.displayString += ' (' + this.reference.publication_year + ')';
      } else {
        if (this.displayString !== this.reference.uniquename) {
          this.displayString = this.reference.uniquename;
        }
      }

      if (this.linkText) {
        this.popoverContents = [this.displayString];
        this.displayString = this.linkText;
        return;
      }

      if (this.showRefTitle && this.reference.title) {
        const m = this.reference.title.match(/(^.{1,60}\S+)/);
        if (m) {
          this.refTitle = m[0];
          if (this.refTitle !== this.reference.title) {
              this.refTitle += ' ...';
          }
        } else {
          this.refTitle = this.reference.title;
        }
      }
    }

    if (this.reference.gene_count > 0 || this.reference.genotype_count > 0) {
      this.isPMID = true;
    }

    if (this.reference.title) {
      this.popoverContents = [this.reference.title];
      if (this.reference.citation) {
        this.popoverContents.push(this.reference.citation);
      }
    } else {
      this.popoverContents = [this.displayString];
    }
  }
}