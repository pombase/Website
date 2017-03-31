import externalLinksConfig from './config/external-links.json';
import pombaseConfig from '../../pombase_v2_config.json';

export interface TermPageConfig {
  ancestorRelNames: Array<string>;
}

export interface LinkoutConfig {
  [name: string]: string;
}

export interface EvidenceConfig {
  [name: string]: {
    long?: string;
    link?: string;
  };
}

export interface AppConfig {
  organism: {
    genus: string,
    species: string,
  };

  termPageConfig: TermPageConfig;

  linkoutConfig: LinkoutConfig;

  evidenceTypes: EvidenceConfig;

  // return true iff the genus and species match the configured organism
  isConfigOrganism(genus: string, species: string): boolean;
}

export interface TermFilterCategoryAncestor {
  rel_name: string;
  termid: string;
}

export interface TermFilterCategory {
  display_name: string;
  ancestors: Array<TermFilterCategoryAncestor>;
}

export interface TermFilterConfig {
  display_name: string;
  categories: Array<TermFilterCategory>;
}

export interface FilterConfig {
  term?: TermFilterConfig;
}

export interface AnnotationType {
  display_name: string;
  inherits_from?: string;
  split_by_parents?: Array<any>;
  columns_to_show?: Array<string>;
  hide_term_details?: boolean;
  filters: Array<FilterConfig>;
  misc_config?: {
    [key: string]: any;
  };
}

export interface AnnotationTypes {
  [annotationTypeName: string]: AnnotationType;
}

export interface ExtensionConfig {
}

export interface InteractionDirectionalLabels {
  bait: string;
  prey: string;
}

export interface AnnotationTableConfig {
  annotationTypeOrder: Array<string>;
  extensions: ExtensionConfig;
  annotationTypes: AnnotationTypes;
  interactionDirectionalLabels: {
    [evidence: string]: InteractionDirectionalLabels,
  };
  getAnnotationType(annotationTypeName: string): AnnotationType;
}

let _config: AnnotationTableConfig = {
  annotationTypes: pombaseConfig.cv_config,
  annotationTypeOrder: [
    'molecular_function',
    'biological_process',
    'cellular_component',
    'single_allele_phenotype',
    'multi_allele_phenotype',
    'complementation',
    'target_of',
    'PomBase family or domain',
    'PSI-MOD',
    'qualitative_gene_expression',
    'quantitative_gene_expression',
    'misc',
    'physical_interactions',
    'genetic_interactions',
    'orthologs',
    'paralogs',
    'species_dist',
    'disease_associated',
    'warning',
    'subunit_composition',
  ],
  extensions: {
  },
  interactionDirectionalLabels: {
    'Co-crystal Structure': {
      bait: 'co-crystallizes with',
      prey: 'co-crystallizes with',
    },
    'Co-fractionation': {
      bait: 'co-fractionates with',
      prey: 'co-fractionates with',
    },
    'Co-localization': {
      bait: 'co-localizes with',
      prey: 'co-localizes with',
    },
    'Co-purification': {
      bait: 'co-purifies with',
      prey: 'co-purifies with',
    },
    'Reconstituted Complex': {
      bait: 'forms complex with',
      prey: 'forms complex with',
    },
    'Affinity Capture-Luminescence': {
      bait: 'affinity captures',
      prey: 'affinity captured by',
    },
    'Affinity Capture-MS': {
      bait: 'affinity captures',
      prey: 'affinity captured by',
    },
    'Affinity Capture-RNA': {
      bait: 'affinity captures',
      prey: 'affinity captured by',
    },
    'Affinity Capture-Western': {
      bait: 'affinity captures',
      prey: 'affinity captured by',
    },
    'Biochemical Activity': {
      bait: 'modifies',
      prey: 'modified by',
    },
    'Far Western': {
      bait: 'captures',
      prey: 'captured by',
    },
    'FRET': {
      bait: 'fluorescence resonance energy donor to',
      prey: 'fluorescence resonance energy acceptor from',
    },
    'PCA': {
      bait: 'interacts with',
      prey: 'interacts with',
    },
    'Protein-peptide': {
      bait: 'binds to peptide derived from',
      prey: 'peptide from this protein binds to',
    },
    'Protein-RNA': {
      bait: 'binds to RNA',
      prey: 'binds to protein',
    },
    'Two-hybrid': {
      bait: 'binds activation domain construct with',
      prey: 'binds DNA-binding domain construct with',
    },
    'Negative Genetic': {
      bait: 'negative genetic interaction with',
      prey: 'negative genetic interaction with',
    },
    'Positive Genetic': {
      bait: 'positive genetic interaction with',
      prey: 'positive genetic interaction with',
    },
    'Synthetic Growth Defect': {
      bait: 'synthetic growth defect with',
      prey: 'synthetic growth defect with',
    },
    'Synthetic Haploinsufficiency': {
      bait: 'synthetic haploinsufficient with',
      prey: 'synthetic haploinsufficient with',
    },
    'Synthetic Lethality': {
      bait: 'synthetic lethal with',
      prey: 'synthetic lethal with',
    },
    'Synthetic Rescue': {
      bait: 'synthetically rescued by',
      prey: 'synthetically rescues',
    },
    'Dosage Growth Defect': {
      bait: 'growth defect in presence of overexpressed',
      prey: 'overexpression causes growth defect to',
    },
    'Dosage Lethality': {
      bait: 'inviable in presence of overexpressed',
      prey: 'overexpression lethal to',
    },
    'Dosage Rescue': {
      bait: 'rescued by overexpression of',
      prey: 'overexpression rescues',
    },
    'Phenotypic Enhancement': {
      bait: 'phenotype enhanced by',
      prey: 'enhances phenotype of',
    },
    'Phenotypic Suppression': {
      bait: 'rescued by',
      prey: 'rescues',
    },
  },
  getAnnotationType:
  function(annotationTypeName: string): AnnotationType {
    return _config.annotationTypes[annotationTypeName] || _config.annotationTypes['_DEFAULT_'];
  },
};

for (let configName of Object.keys(_config.annotationTypes)) {
  let thisConfig = _config.annotationTypes[configName];
  if (thisConfig.inherits_from != null) {
    let parentConfig = _config.annotationTypes[thisConfig.inherits_from];

    if (!parentConfig) {
      throw new Error('No such configuration ' + thisConfig.inherits_from +
                      ' to inherit from in config for: ' + configName);
    }

    let newConfig = {};
    Object.assign(newConfig, parentConfig, thisConfig);
    Object.assign(thisConfig, newConfig);
  }
}

let _appConfig: AppConfig = {
  organism: {
    genus: 'Schizosaccharomyces',
    species: 'pombe',
  },

  termPageConfig: {
    ancestorRelNames: ['is_a', 'part_of', 'regulates'],
  },

  linkoutConfig: {
    pro: 'http://www.proconsortium.org/cgi-bin/pro/entry_pro?id=',
    pfam: 'http://pfam.xfam.org/family/',
  },

  evidenceTypes: {
    IMP: {
      long: 'Inferred from Mutant Phenotype',
      link: 'http://www.geneontology.org/page/imp-inferred-mutant-phenotype',
    },
    IDA: {
      long: 'Inferred from Direct Assay',
      link: 'http://www.geneontology.org/page/ida-inferred-direct-assay',
    },
    IGI: {
      long: 'Inferred from Genetic Interaction',
      link: 'http://www.geneontology.org/page/igi-inferred-genetic-interaction',
    },
    IPI: {
      long: 'Inferred from Physical Interaction',
      link: 'http://www.geneontology.org/page/ipi-inferred-physical-interaction',
    },
    EXP: {
      long: 'Inferred from Experiment',
      link: 'http://www.geneontology.org/page/exp-inferred-experiment',
    },
    IEP: {
      long: 'Inferred from Expression Pattern',
      link: 'http://www.geneontology.org/page/iep-inferred-expression-pattern',
    },
    ISS: {
      long: 'Inferred from Sequence or Structural Similarity',
      link: 'http://www.geneontology.org/page/iss-inferred-sequence-or-structural-similarity',
    },
    ISO: {
      long: 'Inferred from Sequence Orthology',
      link: 'http://www.geneontology.org/page/iso-inferred-sequence-orthology',
    },
    ISA: {
      long: 'Inferred from Sequence Alignment',
      link: 'http://www.geneontology.org/page/isa-inferred-sequence-alignment',
    },
    ISM: {
      long: 'Inferred from Sequence Model',
      link: 'http://www.geneontology.org/page/ism-inferred-sequence-model',
    },
    IGC: {
      long: 'Inferred from Genomic Context',
      link: 'http://www.geneontology.org/page/igc-inferred-genomic-context',
    },
    IBA: {
      long: 'Inferred from Biological aspect of Ancestor',
      link: 'http://www.geneontology.org/page/iba-inferred-biological-aspect-ancestor',
    },
    IBD: {
      long: 'Inferred from Biological aspect of Descendant',
      link: 'http://www.geneontology.org/page/ibd-inferred-biological-aspect-descendent',
    },
    IKR: {
      long: 'Inferred from Key Residues',
      link: 'http://www.geneontology.org/page/ikr-inferred-key-residues',
    },
    IRD: {
      long: 'Inferred from Rapid Divergence',
      link: 'http://www.geneontology.org/page/ird-inferred-rapid-divergence',
    },
    RCA: {
      long: 'inferred from Reviewed Computational Analysis',
      link: 'http://www.geneontology.org/page/rca-inferred-reviewed-computational-analysis',
    },
    NAS: {
      long: 'Non-traceable Author Statement',
      link: 'http://www.geneontology.org/page/nas-non-traceable-author-statement',
    },
    IC: {
      long: 'Inferred by Curator',
      link: 'http://www.geneontology.org/page/ic-inferred-curator',
    },
    ND: {
      long: 'No biological Data available',
      link: 'http://www.geneontology.org/page/nd-no-biological-data-available',
    },
    IEA: {
      long: 'Inferred from Electronic Annotation',
      link: 'http://www.geneontology.org/page/automatically-assigned-evidence-codes',
    },
    NR: {
      long: 'Not Recorded',
      link: 'http://www.geneontology.org/page/nr-not-recorded',
    },
    TAS: {
      long: 'Traceable Author Statement',
      link: 'http://www.geneontology.org/page/tas-traceable-author-statement',
    },
    UNK: {
      long: 'Unknown',
    },
  },

  isConfigOrganism(genus: string, species: string): boolean {
    return genus === this.organism.genus && species === this.organism.species;
  }
};

export function getAnnotationTableConfig(): AnnotationTableConfig {
  return _config;
}

export function getAppConfig(): AppConfig {
  return _appConfig;
}

export function getExternalLinkWithPrefix(prefix: string, id: string): string {
  let linkTemplate = externalLinksConfig[prefix];

  if (linkTemplate) {
    return linkTemplate.replace(/\[example_id\]/, id);
  } else {
    return null;
  }
}

export function getExternalLink(idWithPrefix: string): string {
  let matches = idWithPrefix.match(/^([^:]+):(.*)/);

  if (matches) {
    return getExternalLinkWithPrefix(matches[1], matches[2]);
  } else {
    return null;
  }
}

let organismPrefix = {
  'Homo_sapiens': 'ENSEMBL',
  'Saccharomyces_cerevisiae': 'SGD',
};

export function getOrganismExternalLink(organismGenus: string, organismSpecies: string, id: string): string {
  return getExternalLinkWithPrefix(organismPrefix[organismGenus + '_' + organismSpecies], id);
}
