import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {schemaTypes} from '../../gamedevsyndicate/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Gamedevsyndicate',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'iu8qgjyf',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',

  plugins: [
    structureTool(), 
    visionTool(),
    colorInput(),
  ],

  schema: {
    types: schemaTypes as any,
  },
})
