import { defineField, defineType } from 'sanity'
import { colorSelectionField, customColorField, opacityPresetField } from './utils/colorSelection'

export default defineType({
  name: 'textAndImageListBlock',
  title: 'Text and Image List Block',
  type: 'object',
  fields: [
    defineField({
      name: 'internalLabel',
      title: 'Internal Label',
      type: 'string',
      description: '🏷️ For CMS organization only - not displayed on the website. Use this to identify this block in the editor (e.g., "Feature List", "Content Gallery")',
      placeholder: 'e.g., Latest Features',
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: '📝 Optional title displayed above the content list',
    }),
    colorSelectionField(
      'backgroundColorSelection',
      'Background Color',
      'Choose background color from design system or use custom color'
    ),
    opacityPresetField(
      'backgroundOpacityPreset',
      'Background Opacity'
    ),
    customColorField(
      'customBackgroundColor',
      'Custom Background Color',
      'Custom background color when not using design system colors'
    ),
    colorSelectionField(
      'textContainerBackgroundColorSelection',
      'Text Container Background Color',
      'Choose background color for text containers from design system or use custom color'
    ),
    opacityPresetField(
      'textContainerBackgroundOpacityPreset',
      'Text Container Background Opacity'
    ),
    customColorField(
      'customTextContainerBackgroundColor',
      'Custom Text Container Background Color',
      'Custom background color for text containers when not using design system colors'
    ),
    defineField({
      name: 'articles',
      title: 'Content Items',
      type: 'array',
      description: '📄 Add content items to display',
      of: [
        {
          type: 'object',
          name: 'textAndImageItem',
          title: 'Text and Image Item',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              description: '📝 Item title',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'text',
              title: 'Text Content',
              type: 'array',
              description: '📄 Item text content',
              of: [
                {
                  type: 'block',
                  styles: [
                    { title: 'Normal', value: 'normal' },
                    { title: 'H3', value: 'h3' },
                    { title: 'H4', value: 'h4' },
                    { title: 'Quote', value: 'blockquote' },
                  ],
                  marks: {
                    decorators: [
                      { title: 'Strong', value: 'strong' },
                      { title: 'Emphasis', value: 'em' },
                      { title: 'Code', value: 'code' },
                    ],
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'Link',
                        fields: [
                          {
                            name: 'href',
                            type: 'string',
                            title: 'URL',
                          },
                          {
                            name: 'blank',
                            type: 'boolean',
                            title: 'Open in new tab',
                            initialValue: false,
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              description: '🖼️ Item image (optional)',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative text',
                  description: 'Important for SEO and accessibility',
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
            },
            prepare(selection: any) {
              return {
                title: selection.title || 'Untitled Item',
                media: selection.media,
              }
            },
          },
        },
      ],
      validation: Rule => Rule.required().min(1).max(10),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      description: '📐 Choose how content is displayed',
      options: {
        list: [
          { title: 'Vertical Stack', value: 'vertical' },
          { title: 'Horizontal Scroll', value: 'horizontal' },
        ],
        layout: 'radio',
      },
      initialValue: 'vertical',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      description: '🖼️ Choose where the image appears relative to text',
      options: {
        list: [
          { title: 'Above Text', value: 'top' },
          { title: 'Left of Text', value: 'left' },
          { title: 'Right of Text', value: 'right' },
          { title: 'Below Text', value: 'bottom' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'imageAlignment',
      title: 'Alternate Image Sides (Vertical Layout)',
      type: 'boolean',
      description: '🔄 When using left/right position in vertical layout, alternate sides for each item',
      initialValue: false,
      hidden: ({ parent }) => parent?.layout === 'horizontal' || (parent?.imagePosition !== 'left' && parent?.imagePosition !== 'right'),
    }),
    defineField({
      name: 'imageSize',
      title: 'Image Size',
      type: 'string',
      description: '📏 Choose the size of the images',
      options: {
        list: [
          { title: 'Small (20%)', value: 'small' },
          { title: 'Medium (30%)', value: 'medium' },
          { title: 'Large (40%)', value: 'large' },
        ],
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'verticalAlignment',
      title: 'Vertical Alignment',
      type: 'string',
      description: '⬆️⬇️ Align image and content vertically',
      options: {
        list: [
          { title: 'Top', value: 'start' },
          { title: 'Center', value: 'center' },
          { title: 'Bottom', value: 'end' },
        ],
        layout: 'radio',
      },
      initialValue: 'start',
    }),
    defineField({
      name: 'spacing',
      title: 'Item Spacing',
      type: 'string',
      description: '↕️ Space between items',
      options: {
        list: [
          { title: 'Compact', value: 'compact' },
          { title: 'Normal', value: 'normal' },
          { title: 'Relaxed', value: 'relaxed' },
        ],
      },
      initialValue: 'normal',
    }),
    defineField({
      name: 'itemSize',
      title: 'Item Size (Vertical Layout)',
      type: 'string',
      description: '📏 Choose the height of list items',
      options: {
        list: [
          { title: 'Small', value: 'small' },
          { title: 'Medium', value: 'medium' },
          { title: 'Large', value: 'large' },
        ],
      },
      initialValue: 'small',
      hidden: ({ parent }) => parent?.layout === 'horizontal',
    }),
  ],
  preview: {
    select: {
      internalLabel: 'internalLabel',
      title: 'title',
      layout: 'layout',
      articleCount: 'articles.length',
    },
    prepare(selection) {
      const { internalLabel, title, layout, articleCount } = selection
      const layoutIcon = layout === 'horizontal' ? '↔️' : '↕️'
      const count = articleCount || 0
      return {
        title: internalLabel || title || 'Text and Image List Block',
        subtitle: `${layoutIcon} ${layout || 'vertical'} • ${count} item${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
