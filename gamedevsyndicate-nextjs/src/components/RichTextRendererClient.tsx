"use client"

import React from 'react'
import { PortableText } from '@portabletext/react'
import { createCustomComponents } from './CustomBlocks'
import type { PortableTextBlock } from '@portabletext/types'
import type { DesignSystem } from '../types/designSystem'

interface Props {
  value: PortableTextBlock | PortableTextBlock[]
  designSystem?: DesignSystem | null
}

export default function RichTextRendererClient({ value, designSystem = null }: Props) {
  const customComponents = createCustomComponents(designSystem);
  return <PortableText value={value} components={customComponents} />
}
