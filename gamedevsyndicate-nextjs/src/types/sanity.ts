// Sanity content types

// Design system color selection type
export type ColorSelection = 'primary' | 'secondary' | 'tertiary' | 'buttonPrimary' | 'buttonSecondary' | 'custom';

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface SanitySlug {
  current: string;
  _type: 'slug';
}

// Block types
export interface ImageBlock {
  _type: 'imageBlock';
  _key: string;
  internalLabel?: string; // For CMS organization only - not displayed on website
  image: SanityImage;
  alt: string;
  caption?: string;
  width: 'small' | 'medium' | 'large' | 'full';
}

export interface TextBlock {
  _type: 'textBlock';
  _key: string;
  internalLabel?: string; // For CMS organization only - not displayed on website
  heading?: string;
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4';
  text: unknown[];
  textAlign: 'left' | 'center' | 'right';
  enableAnimation?: boolean;
}

export interface ButtonBlock {
  _type: 'buttonBlock';
  _key: string;
  internalLabel?: string; // For CMS organization only - not displayed on website
  text: string;
  url: string;
  style: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
  openInNewTab: boolean;
  alignment?: 'left' | 'center' | 'right';
  backgroundColorSelection?: ColorSelection;
  customBackgroundColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  backgroundOpacityPreset?: string;
  textColorSelection?: ColorSelection;
  customTextColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  textOpacityPreset?: string;
}

export interface ButtonListBlock {
  _type: 'buttonListBlock';
  _key: string;
  internalLabel?: string; // For CMS organization only - not displayed on website
  title?: string;
  buttons: ButtonBlock[];
  layout: 'vertical' | 'horizontal';
  spacing?: 'compact' | 'normal' | 'relaxed';
  alignment?: 'left' | 'center' | 'right';
  backgroundColorSelection?: ColorSelection;
  customBackgroundColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  backgroundOpacityPreset?: string;
}

export interface SocialMediaLink {
  _type: 'socialMediaLink';
  _key: string;
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'youtube' | 'github' | 'discord' | 'twitch' | 'tiktok' | 'reddit' | 'medium' | 'mastodon' | 'bluesky' | 'threads' | 'website' | 'email';
  url: string;
  label?: string;
}

export interface SocialMediaBlock {
  _type: 'socialMediaBlock';
  _key: string;
  internalLabel?: string;
  title?: string;
  links: SocialMediaLink[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  showLabels?: boolean;
  iconSize?: 'medium' | 'large';
  linkColorSelection?: string;
  customLinkColor?: {
    hex: string;
    alpha?: number;
  };
}

export interface ContactBlock {
  _type: 'contactBlock';
  _key: string;
  internalLabel?: string; // For CMS organization only - not displayed on website
  title?: string;
  nameLabel?: string;
  emailLabel?: string;
  messageLabel?: string;
  buttonText?: string;
  // Form container styling
  containerBackgroundColorSelection?: ColorSelection;
  customContainerBackgroundColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  containerBorderColorSelection?: ColorSelection;
  customContainerBorderColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  // Input field styling
  inputBackgroundColorSelection?: ColorSelection;
  customInputBackgroundColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  inputBorderColorSelection?: ColorSelection;
  customInputBorderColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  inputTextColorSelection?: ColorSelection;
  customInputTextColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  // Button styling
  buttonBackgroundColorSelection?: ColorSelection;
  customButtonBackgroundColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  buttonTextColorSelection?: ColorSelection;
  customButtonTextColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  buttonSize?: 'small' | 'medium' | 'large' | 'xl';
  successMessage?: string;
  errorMessage?: string;
  recipientEmail?: string;
}

export interface ImageTextBlock {
  _type: 'imageTextBlock';
  _key: string;
  internalLabel?: string; // For CMS organization only - not displayed on website
  title?: string;
  image?: SanityImage & { alt?: string };
  text?: unknown[];
  imagePosition?: 'left' | 'right';
  imageSize?: 'small' | 'medium' | 'large' | 'half';
  backgroundColorSelection?: string;
  customBackgroundColor?: {
    hex: string;
    alpha?: number;
    rgb: { r: number; g: number; b: number; a: number };
  };
  verticalAlignment?: 'start' | 'center' | 'end';
}

export interface TextAndImage {
  _id: string;
  _type: 'textAndImage';
  title: string;
  text: unknown[];
  image?: SanityImage & { alt?: string };
  publishedAt?: string;
}

export interface TextAndImageBlock {
  _type: 'textAndImageBlock';
  _key: string;
  internalLabel?: string; // For CMS organization only - not displayed on website
  article: TextAndImage;
  imageAlignment?: 'left' | 'right';
  imageSize?: 'small' | 'medium' | 'large';
  verticalAlignment?: 'start' | 'center' | 'end';
  textAlign?: 'left' | 'center' | 'right';
}

export interface TextAndImageItem {
  _key: string;
  title: string;
  text: unknown[];
  image?: SanityImage & { alt?: string };
}

export interface TextAndImageListBlock {
  _type: 'textAndImageListBlock';
  _key: string;
  internalLabel?: string;
  title?: string;
  articles: TextAndImageItem[];
  layout?: 'vertical' | 'horizontal';
  imagePosition?: 'top' | 'left' | 'right' | 'bottom';
  imageAlignment?: boolean;
  imageSize?: 'small' | 'medium' | 'large';
  itemSize?: 'small' | 'medium' | 'large';
  verticalAlignment?: 'start' | 'center' | 'end';
  spacing?: 'compact' | 'normal' | 'relaxed';
  backgroundColorSelection?: string;
  customBackgroundColor?: {
    hex: string;
    alpha?: number;
    rgb: { r: number; g: number; b: number; a: number };
  };
}

export type ContentBlock = ImageBlock | TextBlock | ButtonBlock | ButtonListBlock | ContactBlock | SocialMediaBlock | CompanyBlock | CompanyListBlock | CompactCompanyListBlock | ContentSeparatorBlock | ImageTextBlock | TextAndImageBlock | TextAndImageListBlock;

// Document types
export interface NavigationItem {
  title: string;
  url: string;
  openInNewTab: boolean;
}

export interface PageBackground {
  type: 'solid' | 'gradient' | 'image' | 'custom';
  solidColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientFrom?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientTo?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientDirection?: 'to-b' | 'to-t' | 'to-r' | 'to-l' | 'to-br' | 'to-bl' | 'radial';
  gradientStartPosition?: number;
  gradientEndPosition?: number;
  backgroundImage?: SanityImage;
  customCSS?: string;
}

export interface OverlayTexture {
  enabled: boolean;
  svgFile?: {
    _type: 'file';
    asset: {
      _ref: string;
      _type: 'reference';
      url?: string;
    };
  };
  patternSize?: '200px' | '400px' | '600px' | '800px' | 'custom';
  customPatternSize?: string;
  tileMode?: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat' | 'space' | 'round';
  colorType?: 'solid' | 'gradient';
  solidColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientFrom?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientTo?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientDirection?: 'to-b' | 'to-t' | 'to-r' | 'to-l' | 'to-br' | 'to-bl' | 'radial';
  gradientStartPosition?: number;
  gradientEndPosition?: number;
  opacity?: number;
}

export interface SiteConfig {
  _id: string;
  _type: 'siteConfig';
  menuColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  // New design system menu color fields
  menuColorSelection?: ColorSelection;
  customMenuColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  // Navigation text color fields
  navigationTextColorSelection?: ColorSelection;
  customNavigationTextColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  // Navigation active indicator color fields
  navigationActiveColorSelection?: ColorSelection;
  customNavigationActiveColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  pageBackground?: PageBackground;
  overlayTexture?: OverlayTexture;
  navigationItems?: NavigationItem[];
}

export interface Page {
  _id: string;
  _type: 'page';
  internalLabel?: string; // For CMS organization only - not displayed on website
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  slug: SanitySlug;
  showInNavigation?: boolean;
  navigationOrder?: number;
  backgroundColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  bannerConfig?: {
    enableBanner?: boolean;
    bannerImage?: SanityImage;
    bannerPosition?: {
      offsetX?: number;
      offsetY?: number;
      scale?: number;
    };
    enableBannerAnimation?: boolean;
  };
  sections?: HomepageSection[]; // Content sections with individual backgrounds and styling
}

export interface ArticlePage {
  _id: string;
  _type: 'articlePage';
  internalLabel?: string;
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  featuredImage?: SanityImage & { alt?: string };
  showInNavigation?: boolean;
  navigationOrder?: number;
  tags?: string[];
  category?: 'news' | 'blog' | 'tutorial' | 'case-study' | 'announcement' | 'other';
  backgroundColorSelection?: string;
  customBackgroundColor?: {
    hex: string;
    alpha?: number;
    rgb: { r: number; g: number; b: number; a: number };
  };
  content: unknown[];
  relatedArticles?: ArticlePage[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface SectionBackground {
  type: 'none' | 'solid' | 'gradient' | 'image';
  // Legacy color fields for backward compatibility
  solidColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientFrom?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientTo?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  // New design system color selection fields
  solidColorSelection?: ColorSelection;
  customSolidColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientFromSelection?: ColorSelection;
  customGradientFrom?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientToSelection?: ColorSelection;
  customGradientTo?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientDirection?: 'to-b' | 'to-r' | 'to-br' | 'radial';
  gradientStartPosition?: number;
  gradientEndPosition?: number;
  backgroundImage?: SanityImage;
}

export interface SectionPadding {
  top: string;
  bottom: string;
}

export interface HomepageSection {
  _key: string;
  title?: string;
  background?: SectionBackground;
  shadow?: boolean;
  overlayTexture?: OverlayTexture;
  padding?: SectionPadding;
  content?: ContentBlock[];
  contentAlignment?: 'left' | 'center' | 'right';
}

export interface Homepage {
  _id: string;
  _type: 'homepage';
  metaTitle?: string;
  metaDescription?: string;
  bannerImage: SanityImage;
  bannerPosition?: {
    offsetX?: number;
    offsetY?: number;
    scale?: number;
  };
  enableBannerAnimation?: boolean;
  textArea?: unknown[];
  enableTextAreaAnimation?: boolean;
  sections?: HomepageSection[];
  blockArea?: (ImageBlock | TextBlock | ButtonBlock)[];
  backgroundColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
}

export interface Company {
  _id: string;
  _type: 'company';
  name: string;
  logo?: SanityImage;
  nameIncludedInLogo?: boolean;
  heroImage?: SanityImage & { alt?: string };
  ceoName?: string;
  email?: string;
  description?: string;
}

export interface CompanyBlock {
  _type: 'companyBlock';
  _key: string;
  internalLabel?: string;
  company: Company;
  layout?: 'card' | 'horizontal' | 'minimal';
}

export interface SanityColorFull {
  _type: 'color';
  hex: string;
  alpha?: number;
  hsl?: Record<string, unknown>;
  hsv?: Record<string, unknown>;
  rgb?: Record<string, unknown>;
}

export interface ContentSeparatorBlock {
  _type: 'contentSeparator';
  _key: string;
  internalLabel?: string;
  lineColorSelection?: string;
  customLineColor?: SanityColorFull;
  diamondColorSelection?: string;
  customDiamondColor?: SanityColorFull;
  // Legacy support
  lineColor?: SanityColorFull;
  diamondColor?: SanityColorFull;
  strokeWidth?: number;
  height?: string;
  margin?: {
    top?: string;
    bottom?: string;
  };
}

export interface CompanyListBlock {
  _type: 'companyListBlock';
  _key: string;
  internalLabel?: string; // For CMS organization only - not displayed on website
  title?: string;
  companies: Company[];
  backgroundColorSelection?: string;
  customBackgroundColor?: {
    hex: string;
    alpha?: number;
    rgb: { r: number; g: number; b: number; a: number };
  };
  borderColorSelection?: string;
  customBorderColor?: {
    hex: string;
    alpha?: number;
    rgb: { r: number; g: number; b: number; a: number };
  };
  // Legacy support
  backgroundColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  borderColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
}

export interface CompactCompanyListBlock {
  _type: 'compactCompanyListBlock';
  _key: string;
  internalLabel?: string; // For CMS organization only - not displayed on website
  title?: string;
  companies: Company[];
  layout?: 'grid' | 'list' | 'carousel' | 'honeycomb' | 'tiltedsquare';
  maxItemsPerRow?: number;
  backgroundColorSelection?: string;
  customBackgroundColor?: {
    hex: string;
    alpha?: number;
    rgb: { r: number; g: number; b: number; a: number };
  };
  borderColorSelection?: string;
  customBorderColor?: {
    hex: string;
    alpha?: number;
    rgb: { r: number; g: number; b: number; a: number };
  };
  // Legacy support
  backgroundColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  borderColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
}
