export type FileCategory = 'image' | 'document' | 'video' | 'audio' | 'video-audio' | 'pdf-document' | 'gif' | 'archive';

export interface CategoryDefinition {
  id: FileCategory;
  name: string;
  emoji: string;
  description: string;
  slug: string;
  iconName: string;
}

export type ToolType = 'convert' | 'compress' | 'utility';

export type EngineSupport = 'client_native' | 'cloud_pipeline' | 'coming_soon';

export type ProcessingType = 'local' | 'server' | 'hybrid';

export type ToolImplementationStatus = 'ready' | 'beta' | 'server_pending' | 'not_implemented';

export interface FormatComparisonPoint {
  feature: string;
  fromValue: string;
  toValue: string;
  advantage?: 'from' | 'to' | 'neutral';
}

export interface FormatComparison {
  fromName: string;
  toName: string;
  fromExt: string;
  toExt: string;
  points: FormatComparisonPoint[];
}

export interface HowToStep {
  step: number;
  title: string;
  instruction: string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolSeo {
  title: string;
  metaDescription: string;
  canonical: string;
  keywords: string[];
}

export interface ToolSitemap {
  include: boolean;
  priority: number;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

export interface FormatGuide {
  title: string;
  badge: string;
  description: string;
  pros: string[];
  cons: string[];
}

export interface ConversionStepDetail {
  step: number;
  title: string;
  explanation: string;
}

export interface AcceptedFilesGuide {
  extensions: string[];
  description: string;
  maxSize: string;
  notes?: string;
}

export interface ResultOutputGuide {
  format: string;
  description: string;
  features: string[];
}

export interface ToolGuideArticle {
  title: string;
  h1: string;
  summary: string; // Focused blog tutorial under 1000 characters
  readingTime?: string;
  whyUseThis?: string[];
  stepByStep?: { step: number; title: string; desc: string }[];
  expertTip?: string;
}

export interface ToolConfig {
  id: string;
  slug: string;
  routePath: string; // e.g. "/convert/jpg-to-png" or "/compress/compress-jpeg"
  category: FileCategory;
  type: ToolType;

  name: string;
  shortName: string;
  title: string;
  h1: string;

  description: string;
  contextualDescription: string;
  badge?: string;

  inputFormats: string[];
  outputFormats: string[];
  defaultOutputFormat: string;

  // Pipeline architecture
  processingType: ProcessingType;
  status?: ToolImplementationStatus;
  statusExplanation?: string;
  maxFileSize?: number;

  features: string[];
  howToSteps: HowToStep[];
  formatComparison?: FormatComparison;

  // Rich in-depth SEO & contextual education
  whatIsFrom?: FormatGuide;
  whatIsTo?: FormatGuide;
  whyConvertReason?: {
    heading: string;
    description: string;
    points: { title: string; desc: string }[];
  };
  whatHappensDuringConversion?: ConversionStepDetail[];
  acceptedFilesGuide?: AcceptedFilesGuide;
  expectedResultGuide?: ResultOutputGuide;

  seo: ToolSeo;
  faq: ToolFaq[];
  relatedTools: string[]; // Slugs of related tools
  guideArticle?: ToolGuideArticle;

  sitemap: ToolSitemap;
}

export interface FileTool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: FileCategory;
  type: ToolType;
  fromFormat: string;
  toFormat?: string;
  engine: EngineSupport;
  isPopular?: boolean;
  badge?: string;
  status?: ToolImplementationStatus;
  processingType?: ProcessingType;
}
