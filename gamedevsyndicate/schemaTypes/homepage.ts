import {defineType, defineField} from 'sanity'
import { colorSelectionField, customColorField } from './utils/colorSelection'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: '🔍 Title shown in browser tabs and search results',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: '🔍 Brief description shown in search results and social media previews',
      rows: 3,
    }),
    // Banner Image
    defineField({
      name: 'bannerImage',
      title: 'Banner Image',
      type: 'image',
      description: 'Large banner image for the top of the homepage',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required(),
    }),
    
    // Banner Position Controls
    defineField({
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
          validation: Rule => Rule.min(-50).max(50),
        },
        {
          name: 'offsetY',
          title: 'Vertical Offset (%)',
          type: 'number',
          description: 'Move banner up/down as percentage (-50% = far up, 50% = far down)',
          initialValue: 0,
          validation: Rule => Rule.min(-50).max(50),
        },
        {
          name: 'scale',
          title: 'Scale (%)',
          type: 'number',
          description: 'Control banner size (100% = normal, 150% = larger, 75% = smaller)',
          initialValue: 100,
          validation: Rule => Rule.min(1).max(300),
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    
    defineField({
      name: 'enableBannerAnimation',
      title: 'Enable Banner Fade-In Animation',
      type: 'boolean',
      description: '✨ When enabled, the banner will fade in when the page loads',
      initialValue: false,
    }),
    
    // Text Area
    defineField({
      name: 'textArea',
      title: 'Text Area',
      type: 'array',
      description: 'Main text content for the homepage with rich formatting options',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                    validation: Rule => Rule.uri({
                      scheme: ['http', 'https', 'mailto', 'tel']
                    })
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean',
                    initialValue: false,
                  }
                ]
              },
              {
                title: 'Text Size',
                name: 'textSize',
                type: 'object',
                fields: [
                  {
                    title: 'Size',
                    name: 'size',
                    type: 'string',
                    options: {
                      list: [
                        {title: 'Extra Small', value: 'xs'},
                        {title: 'Small', value: 'sm'},
                        {title: 'Base', value: 'base'},
                        {title: 'Large', value: 'lg'},
                        {title: 'Extra Large', value: 'xl'},
                        {title: '2X Large', value: '2xl'},
                        {title: '3X Large', value: '3xl'},
                        {title: '4X Large', value: '4xl'},
                        {title: '5X Large', value: '5xl'},
                        {title: '6X Large', value: '6xl'},
                      ],
                    },
                    initialValue: 'base',
                  }
                ]
              },
              {
                title: 'Text Alignment',
                name: 'textAlign',
                type: 'object',
                fields: [
                  {
                    title: 'Alignment',
                    name: 'align',
                    type: 'string',
                    options: {
                      list: [
                        {title: 'Left', value: 'left'},
                        {title: 'Center', value: 'center'},
                        {title: 'Right', value: 'right'},
                        {title: 'Justify', value: 'justify'},
                      ],
                    },
                    initialValue: 'left',
                  }
                ]
              },
              {
                title: 'Font Weight',
                name: 'fontWeight',
                type: 'object',
                fields: [
                  {
                    title: 'Weight',
                    name: 'weight',
                    type: 'string',
                    options: {
                      list: [
                        {title: 'Light', value: 'light'},
                        {title: 'Normal', value: 'normal'},
                        {title: 'Medium', value: 'medium'},
                        {title: 'Semibold', value: 'semibold'},
                        {title: 'Bold', value: 'bold'},
                        {title: 'Extra Bold', value: 'extrabold'},
                      ],
                    },
                    initialValue: 'normal',
                  }
                ]
              },
              {
                title: 'Highlight',
                name: 'highlight',
                type: 'object',
                fields: [
                  colorSelectionField(
                    'colorSelection',
                    'Highlight Color',
                    'Choose highlight color from design system or use custom color'
                  ),
                  customColorField(
                    'customColor',
                    'Custom Highlight Color',
                    'Custom highlight color when not using design system colors'
                  ),
                ]
              },
              {
                title: 'Text Color',
                name: 'textColor',
                type: 'object',
                fields: [
                  colorSelectionField(
                    'colorSelection',
                    'Text Color',
                    'Choose text color from design system or use custom color'
                  ),
                  customColorField(
                    'customColor',
                    'Custom Text Color',
                    'Custom text color when not using design system colors'
                  ),
                ]
              }
            ]
          }
        },
        // Inline images within text
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
              description: 'Important for SEO and accessibility.',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
            {
              name: 'position',
              title: 'Position',
              type: 'string',
              options: {
                list: [
                  {title: 'Center', value: 'center'},
                  {title: 'Left', value: 'left'},
                  {title: 'Right', value: 'right'},
                ],
              },
              initialValue: 'center',
            }
          ]
        },
        // Call-to-action boxes
        {
          type: 'object',
          name: 'callout',
          title: 'Callout Box',
          fields: [
            {
              name: 'type',
              title: 'Callout Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Info', value: 'info'},
                  {title: 'Warning', value: 'warning'},
                  {title: 'Success', value: 'success'},
                  {title: 'Error', value: 'error'},
                ],
              },
              initialValue: 'info',
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'content',
              title: 'Content',
              type: 'text',
            }
          ],
          preview: {
            select: {
              title: 'title',
              type: 'type',
            },
            prepare({title, type}) {
              return {
                title: title || 'Callout',
                subtitle: `${type} callout`,
              }
            },
          },
        }
      ],
    }),
    
    defineField({
      name: 'enableTextAreaAnimation',
      title: 'Enable Text Area Fade-In Animation',
      type: 'boolean',
      description: '✨ When enabled, the text area will slide in when it scrolls into view',
      initialValue: false,
    }),

    // Homepage Sections
    defineField({
      name: 'sections',
      title: 'Homepage Sections',
      type: 'array',
      description: 'Additional content sections for the homepage',
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
                {type: 'compactCompanyListBlock'},
                {type: 'contactBlock'},
                {type: 'textAndImageBlock'},
                {type: 'textAndImageListBlock'},
                {type: 'contentSeparator'}, // Add this line
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

    // Legacy Block Area (for backward compatibility)
    defineField({
      name: 'blockArea',
      title: 'Legacy Block Area',
      type: 'array',
      description: 'Legacy content blocks (use Sections instead for new content)',
      of: [
        {type: 'imageBlock'},
        {type: 'textBlock'},
        {type: 'buttonBlock'},
        {type: 'companyBlock'},
        {type: 'compactCompanyListBlock'},
        {type: 'contactBlock'},
        {type: 'textAndImageBlock'},
        {type: 'textAndImageListBlock'},
        {type: 'contentSeparator'}, // Add this line too
      ],
    }),
  ],
  // Singleton pattern: only one homepage document
  preview: {
    select: {
      title: 'bannerImage.asset.originalFilename',
      sectionCount: 'sections.length',
    },
    prepare({title, sectionCount}) {
      return {
        title: 'Homepage',
        subtitle: `Banner: ${title || 'No banner'} • ${sectionCount || 0} section(s)`,
      }
    },
  },
})
