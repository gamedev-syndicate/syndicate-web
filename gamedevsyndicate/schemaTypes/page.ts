import {defineType, defineField} from 'sanity'
import { colorSelectionField, customColorField, opacityPresetField } from './utils/colorSelection'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalLabel',
      title: 'Internal Label',
      type: 'string',
      description: '🏷️ For CMS organization only - not displayed on the website. Use this to identify this page in the editor (e.g., "Main About Page", "Services Overview")',
      placeholder: 'e.g., Main About Page',
    }),
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: '📝 The page title displayed in navigation, browser tab, and as the main heading',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showInNavigation',
      title: 'Show in Navigation',
      type: 'boolean',
      description: 'Show this page in the main navigation menu',
      initialValue: true,
    }),
    defineField({
      name: 'navigationOrder',
      title: 'Navigation Order',
      type: 'number',
      description: 'Order in navigation menu (lower numbers appear first)',
      initialValue: 100,
      hidden: ({parent}) => !parent?.showInNavigation,
    }),
    // Banner Configuration
    defineField({
      name: 'bannerConfig',
      title: 'Banner Configuration',
      type: 'object',
      description: '🎨 Optional banner image at the top of the page',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'enableBanner',
          title: 'Enable Banner',
          type: 'boolean',
          description: '✨ Toggle to show/hide banner on this page',
          initialValue: false,
        },
        {
          name: 'bannerImage',
          title: 'Banner Image',
          type: 'image',
          description: 'Large banner image for the top of the page',
          options: {
            hotspot: true,
          },
          validation: (Rule) => Rule.custom((value, context) => {
            const parent = context.parent as { enableBanner?: boolean };
            if (parent?.enableBanner && !value) {
              return 'Banner image is required when banner is enabled';
            }
            return true;
          }),
          hidden: ({parent}) => !parent?.enableBanner,
        },
        {
          name: 'bannerPosition',
          title: 'Banner Position',
          type: 'object',
          description: 'Control the position offset of the banner using percentages',
          fields: [
            {
              name: 'offsetX',
              title: 'Horizontal Offset (%)',
              type: 'number',
              description: 'Move banner left/right as percentage (-50% = far left, 50% = far right)',
              initialValue: 0,
              validation: (Rule) => Rule.min(-50).max(50),
            },
            {
              name: 'offsetY',
              title: 'Vertical Offset (%)',
              type: 'number',
              description: 'Move banner up/down as percentage (-50% = far up, 50% = far down)',
              initialValue: 0,
              validation: (Rule) => Rule.min(-50).max(50),
            },
            {
              name: 'scale',
              title: 'Scale (%)',
              type: 'number',
              description: 'Control banner size (100% = normal, 150% = larger, 75% = smaller)',
              initialValue: 100,
              validation: (Rule) => Rule.min(1).max(300),
            },
          ],
          options: {
            collapsible: true,
            collapsed: true,
          },
          hidden: ({parent}) => !parent?.enableBanner,
        },
        {
          name: 'enableBannerAnimation',
          title: 'Enable Banner Fade-In Animation',
          type: 'boolean',
          description: '✨ When enabled, the banner will fade in when the page loads',
          initialValue: false,
          hidden: ({parent}) => !parent?.enableBanner,
        },
      ],
    }),
    // Page Sections
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      description: 'Content sections with individual backgrounds, styling, and content blocks',
      of: [
        {
          type: 'object',
          name: 'contentSection',
          title: 'Content Section',
          fields: [
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
              description: 'Optional title for this section (for organization)',
            },
            {
              name: 'background',
              title: 'Section Background',
              type: 'object',
              description: 'Background settings for this section',
              fields: [
                {
                  name: 'type',
                  title: 'Background Type',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'None (Transparent)', value: 'none'},
                      {title: 'Solid Color', value: 'solid'},
                      {title: 'Gradient', value: 'gradient'},
                      {title: 'Image', value: 'image'},
                    ],
                  },
                  initialValue: 'none',
                },
                {
                  name: 'solidColorSelection',
                  title: 'Background Color',
                  type: 'string',
                  description: 'Choose from design system colors or use custom color',
                  options: {
                    list: [
                      { title: 'Primary', value: 'primary' },
                      { title: 'Secondary', value: 'secondary' },
                      { title: 'Tertiary', value: 'tertiary' },
                      { title: 'Button Primary', value: 'buttonPrimary' },
                      { title: 'Button Secondary', value: 'buttonSecondary' },
                      { title: 'Custom Color', value: 'custom' },
                    ],
                    layout: 'dropdown',
                  },
                  initialValue: 'primary',
                  hidden: ({parent}) => parent?.type !== 'solid',
                },
                {
                  name: 'customSolidColor',
                  title: 'Custom Background Color',
                  type: 'color',
                  description: 'Custom background color when not using design system colors',
                  options: {
                    disableAlpha: false,
                  },
                  hidden: ({parent}) => parent?.type !== 'solid' || parent?.solidColorSelection !== 'custom',
                },
                {
                  name: 'solidOpacityPreset',
                  title: 'Solid Color Opacity',
                  type: 'string',
                  description: '⚠️ Set transparency level. If the selected design system color already has transparency, this preset will multiply with it.',
                  options: {
                    list: [
                      { title: '100% (Solid)', value: '100' },
                      { title: '75% (Strong)', value: '75' },
                      { title: '50% (Medium)', value: '50' },
                      { title: '25% (Subtle)', value: '25' },
                    ],
                    layout: 'dropdown',
                  },
                  initialValue: '100',
                  hidden: ({parent}) => parent?.type !== 'solid' || parent?.solidColorSelection === 'custom',
                },
                {
                  name: 'gradientFromSelection',
                  title: 'Gradient Start Color',
                  type: 'string',
                  description: 'Choose start color from design system or use custom color',
                  options: {
                    list: [
                      { title: 'Primary', value: 'primary' },
                      { title: 'Secondary', value: 'secondary' },
                      { title: 'Tertiary', value: 'tertiary' },
                      { title: 'Button Primary', value: 'buttonPrimary' },
                      { title: 'Button Secondary', value: 'buttonSecondary' },
                      { title: 'Custom Color', value: 'custom' },
                    ],
                    layout: 'dropdown',
                  },
                  initialValue: 'primary',
                  hidden: ({parent}) => parent?.type !== 'gradient',
                },
                {
                  name: 'gradientFromOpacityPreset',
                  title: 'Start Color Opacity',
                  type: 'string',
                  description: '⚠️ Set transparency level for gradient start color.',
                  options: {
                    list: [
                      { title: '100% (Solid)', value: '100' },
                      { title: '75% (Strong)', value: '75' },
                      { title: '50% (Medium)', value: '50' },
                      { title: '25% (Subtle)', value: '25' },
                    ],
                    layout: 'dropdown',
                  },
                  initialValue: '100',
                  hidden: ({parent}) => parent?.type !== 'gradient' || parent?.gradientFromSelection === 'custom',
                },
                {
                  name: 'customGradientFrom',
                  title: 'Custom Gradient Start Color',
                  type: 'color',
                  description: 'Custom start color when not using design system colors',
                  options: {
                    disableAlpha: false,
                  },
                  hidden: ({parent}) => parent?.type !== 'gradient' || parent?.gradientFromSelection !== 'custom',
                },
                {
                  name: 'gradientToSelection',
                  title: 'Gradient End Color',
                  type: 'string',
                  description: 'Choose end color from design system or use custom color',
                  options: {
                    list: [
                      { title: 'Primary', value: 'primary' },
                      { title: 'Secondary', value: 'secondary' },
                      { title: 'Tertiary', value: 'tertiary' },
                      { title: 'Button Primary', value: 'buttonPrimary' },
                      { title: 'Button Secondary', value: 'buttonSecondary' },
                      { title: 'Custom Color', value: 'custom' },
                    ],
                    layout: 'dropdown',
                  },
                  initialValue: 'secondary',
                  hidden: ({parent}) => parent?.type !== 'gradient',
                },
                {
                  name: 'gradientToOpacityPreset',
                  title: 'End Color Opacity',
                  type: 'string',
                  description: '⚠️ Set transparency level for gradient end color.',
                  options: {
                    list: [
                      { title: '100% (Solid)', value: '100' },
                      { title: '75% (Strong)', value: '75' },
                      { title: '50% (Medium)', value: '50' },
                      { title: '25% (Subtle)', value: '25' },
                    ],
                    layout: 'dropdown',
                  },
                  initialValue: '100',
                  hidden: ({parent}) => parent?.type !== 'gradient' || parent?.gradientToSelection === 'custom',
                },
                {
                  name: 'customGradientTo',
                  title: 'Custom Gradient End Color',
                  type: 'color',
                  description: 'Custom end color when not using design system colors',
                  options: {
                    disableAlpha: false,
                  },
                  hidden: ({parent}) => parent?.type !== 'gradient' || parent?.gradientToSelection !== 'custom',
                },
                {
                  name: 'gradientDirection',
                  title: 'Gradient Direction',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Top to Bottom', value: 'to-b'},
                      {title: 'Left to Right', value: 'to-r'},
                      {title: 'Diagonal', value: 'to-br'},
                    ],
                  },
                  initialValue: 'to-b',
                  hidden: ({parent}) => parent?.type !== 'gradient',
                },
                {
                  name: 'gradientStartPosition',
                  title: 'Gradient Start Position (%)',
                  type: 'number',
                  description: 'Where the gradient starts (0-100%)',
                  validation: Rule => Rule.min(0).max(100),
                  initialValue: 0,
                  hidden: ({parent}) => parent?.type !== 'gradient',
                },
                {
                  name: 'gradientEndPosition',
                  title: 'Gradient End Position (%)',
                  type: 'number',
                  description: 'Where the gradient ends (0-100%)',
                  validation: Rule => Rule.min(0).max(100),
                  initialValue: 100,
                  hidden: ({parent}) => parent?.type !== 'gradient',
                },
                {
                  name: 'backgroundImage',
                  title: 'Background Image',
                  type: 'image',
                  hidden: ({parent}) => parent?.type !== 'image',
                },
              ],
            },
            {
              name: 'shadow',
              title: 'Section Shadow',
              type: 'boolean',
              description: 'Add a subtle shadow to this section',
              initialValue: false,
            },
            {
              name: 'overlayTexture',
              title: 'Overlay Texture',
              type: 'object',
              description: 'SVG pattern overlay for this section',
              fields: [
                {
                  name: 'enabled',
                  title: 'Enable Overlay',
                  type: 'boolean',
                  initialValue: false,
                },
                {
                  name: 'svgFile',
                  title: 'SVG Pattern File',
                  type: 'file',
                  description: 'Upload an SVG file to use as a repeating pattern',
                  hidden: ({parent}) => !parent?.enabled,
                  options: {
                    accept: '.svg',
                  },
                },
                {
                  name: 'patternSize',
                  title: 'Pattern Size',
                  type: 'string',
                  options: {
                    list: [
                      {title: '200px', value: '200px'},
                      {title: '400px', value: '400px'},
                      {title: '600px', value: '600px'},
                      {title: '800px', value: '800px'},
                      {title: 'Custom', value: 'custom'},
                    ],
                  },
                  initialValue: '400px',
                  hidden: ({parent}) => !parent?.enabled,
                },
                {
                  name: 'customPatternSize',
                  title: 'Custom Pattern Size',
                  type: 'string',
                  description: 'Enter custom size (e.g., "300px", "1rem")',
                  hidden: ({parent}) => !parent?.enabled || parent?.patternSize !== 'custom',
                },
                {
                  name: 'tileMode',
                  title: 'Tile Mode',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Repeat (both directions)', value: 'repeat'},
                      {title: 'Repeat horizontally only', value: 'repeat-x'},
                      {title: 'Repeat vertically only', value: 'repeat-y'},
                      {title: 'No repeat', value: 'no-repeat'},
                      {title: 'Space evenly', value: 'space'},
                      {title: 'Round to fit', value: 'round'},
                    ],
                  },
                  initialValue: 'repeat',
                  hidden: ({parent}) => !parent?.enabled,
                },
                {
                  name: 'colorType',
                  title: 'Color Type',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Solid Color', value: 'solid'},
                      {title: 'Gradient', value: 'gradient'},
                    ],
                  },
                  initialValue: 'solid',
                  hidden: ({parent}) => !parent?.enabled,
                },
                {
                  name: 'solidColor',
                  title: 'Pattern Color',
                  type: 'color',
                  hidden: ({parent}) => !parent?.enabled || parent?.colorType !== 'solid',
                },
                {
                  name: 'gradientFrom',
                  title: 'Gradient Start Color',
                  type: 'color',
                  hidden: ({parent}) => !parent?.enabled || parent?.colorType !== 'gradient',
                },
                {
                  name: 'gradientTo',
                  title: 'Gradient End Color',
                  type: 'color',
                  hidden: ({parent}) => !parent?.enabled || parent?.colorType !== 'gradient',
                },
                {
                  name: 'gradientDirection',
                  title: 'Gradient Direction',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Top to Bottom', value: 'to-b'},
                      {title: 'Bottom to Top', value: 'to-t'},
                      {title: 'Left to Right', value: 'to-r'},
                      {title: 'Right to Left', value: 'to-l'},
                      {title: 'Top-Left to Bottom-Right', value: 'to-br'},
                      {title: 'Top-Right to Bottom-Left', value: 'to-bl'},
                    ],
                  },
                  initialValue: 'to-br',
                  hidden: ({parent}) => !parent?.enabled || parent?.colorType !== 'gradient',
                },
                {
                  name: 'gradientStartPosition',
                  title: 'Gradient Start Position (%)',
                  type: 'number',
                  description: 'Where the gradient starts (0-100%)',
                  validation: Rule => Rule.min(0).max(100),
                  initialValue: 0,
                  hidden: ({parent}) => !parent?.enabled || parent?.colorType !== 'gradient',
                },
                {
                  name: 'gradientEndPosition',
                  title: 'Gradient End Position (%)',
                  type: 'number',
                  description: 'Where the gradient ends (0-100%)',
                  validation: Rule => Rule.min(0).max(100),
                  initialValue: 100,
                  hidden: ({parent}) => !parent?.enabled || parent?.colorType !== 'gradient',
                },
                {
                  name: 'opacity',
                  title: 'Opacity',
                  type: 'number',
                  description: 'Pattern opacity (0.0 to 1.0)',
                  validation: Rule => Rule.min(0).max(1),
                  initialValue: 0.5,
                  hidden: ({parent}) => !parent?.enabled,
                },
              ],
            },
            {
              name: 'padding',
              title: 'Section Padding',
              type: 'object',
              description: 'Control spacing around section content',
              fields: [
                {
                  name: 'top',
                  title: 'Top Padding',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'None', value: '0'},
                      {title: 'Small', value: '2rem'},
                      {title: 'Medium', value: '4rem'},
                      {title: 'Large', value: '6rem'},
                    ],
                  },
                  initialValue: '4rem',
                },
                {
                  name: 'bottom',
                  title: 'Bottom Padding',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'None', value: '0'},
                      {title: 'Small', value: '2rem'},
                      {title: 'Medium', value: '4rem'},
                      {title: 'Large', value: '6rem'},
                    ],
                  },
                  initialValue: '4rem',
                },
              ],
            },
            {
              name: 'content',
              title: 'Section Content',
              type: 'array',
              description: 'Content blocks for this section',
              of: [
                {type: 'imageBlock'},
                {type: 'textBlock'},
                {type: 'buttonBlock'},
                {type: 'companyBlock'},
                {type: 'companyListBlock'},
                {type: 'compactCompanyListBlock'},
                {type: 'contactBlock'},
                {type: 'textAndImageBlock'},
                {type: 'textAndImageListBlock'},
                {type: 'contentSeparator'},
              ],
            },
            {
              name: 'contentAlignment',
              title: 'Content Alignment',
              type: 'string',
              options: {
                list: [
                  {title: 'Left', value: 'left'},
                  {title: 'Center', value: 'center'},
                  {title: 'Right', value: 'right'},
                ],
              },
              initialValue: 'left',
              description: 'Align all content within this section',
            },
          ],
          preview: {
            select: {
              title: 'title',
              contentCount: 'content.length',
            },
            prepare({title, contentCount}) {
              return {
                title: title || 'Untitled Section',
                subtitle: `${contentCount || 0} content block(s)`,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      internalLabel: 'internalLabel',
      title: 'title',
      slug: 'slug.current',
      showInNav: 'showInNavigation',
      sectionCount: 'sections.length',
    },
    prepare({internalLabel, title, slug, showInNav, sectionCount}) {
      const sections = sectionCount || 0;
      const contentInfo = `${sections} section(s)`;
      
      return {
        title: internalLabel || title || 'Untitled Page',
        subtitle: `📄 Page • /${slug || 'no-slug'} • ${showInNav ? '✓ In Nav' : '✗ Hidden'} • ${contentInfo}`,
      }
    },
  },
})
