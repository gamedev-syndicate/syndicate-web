"use client"

import React from 'react'
import { PortableText } from '@portabletext/react'
import { createCustomComponents } from './CustomBlocks'
import type { PortableTextBlock } from '@portabletext/types'
import type { DesignSystem } from '../types/designSystem'

interface RichTextRendererProps {
  value: PortableTextBlock | PortableTextBlock[]
  designSystem?: DesignSystem | null
}

export default function RichTextRenderer({ value, designSystem = null }: RichTextRendererProps) {
  const customComponents = createCustomComponents(designSystem);
  return <PortableText value={value} components={customComponents} />
}
