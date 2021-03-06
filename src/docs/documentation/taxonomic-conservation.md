## Taxonomic conservation

The Taxonomic conservation section provides manually assigned
classifiers of taxon distribution (at the domain/kingdom level) of the
product of a protein-coding gene. The classifiers come from a small
controlled vocabulary maintained by PomBase curators. All applicable
terms are assigned to a protein.

For each annotation, the summary view shows a text description, which
corresponds to an entry in the internal PBO
<!-- [PBO](/faq/what-pbo-option-advanced-search) -->
term set. The detailed view adds the PBO ID and a count that links to
the [ontology term page](/documentation/ontology-term-page) for the
description.

### Taxonomic conservation terms ###

-   These terms identify the taxonomic groups in which gene product
    ortholog(s) have been identified:
    -   conserved in archaea
    -   conserved in bacteria
    -   conserved in eukaryotes
    -   conserved in fungi
    -   conserved in metazoa
    -   conserved in vertebrates
-   These two terms represent taxon restrictions, and indicate that a
    gene product has not been detected outside these taxa:
    -   conserved in fungi only
    -   conserved in eukaryotes only
-   Other terms
    -   *Schizosaccharomyces* specific - indicates that a gene product is
        only identified in the genus *Schizosaccharomyces* at present,
        but is present in more than one species in this genus
    -   *Schizosaccharomyces pombe* specific - indicates that a gene
        product is identified only in *S. pombe*, not in any other
        species even in the *Schizosaccharomyces* genus
    -   no apparent *S. cerevisiae* ortholog - indicates a gene product
        which is conserved at least outside the *Schizosaccharomyces*
        but is absent from *S. cerevisiae*
    -   faster evolving duplicate - indicates that the copy of a gene
        product which has duplicated after the divergence of
        *Schizosaccharomyces* from other yeasts is evolving faster than
        its duplicate partner (judged because the fission yeast
        duplicate is more closely related to the orthologs in other
        species, but is the best hit of this gene product)
    -   predominantly single copy (one to one) - the gene product is
        conserved largely one-to one across species with minor
        exceptions (for example, frequently duplicated in the vertebrate
        lineage)
    -   orthologs cannot be distinguished - the gene product appears to
        be conserved, but it is not possible to identify orthologs
        unambiguously

### Additional notes: ###

-   Any term which has "conserved in fungi" but does *not* have "no
    apparent *S. cerevisiae* ortholog" will have a manually annotated
    *S. cerevisiae* ortholog.
-   Any gene product which is annotated as "conserved in vertebrates"
    will have a manually annotated human ortholog.
