'use client'

import React from 'react'
import { resolveColor, type ColorReference } from '../../lib/colorUtils'
import type { ButtonListBlock as ButtonListBlockType, ButtonBlock as ButtonBlockType } from '../../types/sanity'
import { designSystemColorToCSS } from '../../lib/background-utils'
import type { DesignSystem } from '../../types/designSystem'

interface ButtonListBlockProps {
  value: ButtonListBlockType
  designSystem?: DesignSystem | null
}

export function ButtonListBlock({ value, designSystem }: ButtonListBlockProps) {

  // Convert Sanity color to ColorReference format
  const convertToColorReference = (sanityColor: { _type?: string; hex: string; alpha?: number } | undefined) => {
    if (!sanityColor) return undefined
    const r = parseInt(sanityColor.hex.slice(1, 3), 16)
    const g = parseInt(sanityColor.hex.slice(3, 5), 16)
    const b = parseInt(sanityColor.hex.slice(5, 7), 16)
    return {
      hex: sanityColor.hex,
      alpha: sanityColor.alpha,
      rgb: { r, g, b, a: sanityColor.alpha || 1 }
    }
  }

  // Resolve background color
  const backgroundColorRef: ColorReference = {
    colorSelection: value.backgroundColorSelection,
    customColor: convertToColorReference(value.customBackgroundColor),
    opacityPreset: value.backgroundOpacityPreset,
  }
  const backgroundColor = resolveColor(backgroundColorRef, designSystem ?? null, 'transparent')

  // Get spacing classes
  const getSpacingClasses = () => {
    switch (value.spacing) {
      case 'compact':
        return 'gap-2 md:gap-3'
      case 'normal':
        return 'gap-3 md:gap-4'
      case 'relaxed':
        return 'gap-4 md:gap-6'
      default:
        return 'gap-3 md:gap-4'
    }
  }

  // Get layout classes - mobile always vertical, desktop respects layout setting
  const getLayoutClasses = () => {
    const baseClasses = 'flex flex-col' // Mobile: always vertical
    const desktopLayout = value.layout === 'horizontal' ? 'md:flex-row md:flex-wrap' : 'md:flex-col'
    return `${baseClasses} ${desktopLayout}`
  }

  // Get alignment classes
  const getAlignmentClasses = () => {
    switch (value.alignment) {
      case 'left':
        return 'justify-start items-start'
      case 'center':
        return 'justify-center items-center'
      case 'right':
        return 'justify-end items-end'
      default:
        return 'justify-center items-center'
    }
  }

  const containerStyle: React.CSSProperties = {}
  if (backgroundColor && backgroundColor !== 'transparent') {
    containerStyle.backgroundColor = backgroundColor
  }

  return (
    <div
      className={`my-8 p-6 rounded-lg ${backgroundColor !== 'transparent' ? 'shadow-lg' : ''}`}
      style={containerStyle}
    >
      {value.title && (
        <h2 className="text-2xl font-bold text-white mb-6 text-center">{value.title}</h2>
      )}
      <div className={`${getLayoutClasses()} ${getSpacingClasses()} ${getAlignmentClasses()}`}>
        {value.buttons?.map((button) => (
          <ButtonItem key={button._key} button={button} designSystem={designSystem} />
        ))}
      </div>
    </div>
  )
}

interface ButtonItemProps {
  button: ButtonBlockType
  designSystem?: DesignSystem | null
}

function ButtonItem({ button, designSystem }: ButtonItemProps) {

  let backgroundColor = ''
  let textColor = ''

  // Resolve background color
  if (button.backgroundColorSelection) {
    if (button.backgroundColorSelection === 'custom' && button.customBackgroundColor) {
      const color = button.customBackgroundColor
      backgroundColor = color.alpha
        ? `rgba(${parseInt(color.hex.slice(1, 3), 16)}, ${parseInt(color.hex.slice(3, 5), 16)}, ${parseInt(color.hex.slice(5, 7), 16)}, ${color.alpha})`
        : color.hex
    } else if (button.backgroundColorSelection !== 'custom' && designSystem?.colors) {
      const colorValue = designSystem.colors[button.backgroundColorSelection as keyof typeof designSystem.colors]
      if (colorValue) {
        backgroundColor = designSystemColorToCSS(colorValue)
      }
    }
  } else if (designSystem?.colors?.buttonPrimary) {
    // Default to buttonPrimary if no color selection specified
    backgroundColor = designSystemColorToCSS(designSystem.colors.buttonPrimary)
  }

  // Resolve text color
  if (button.textColorSelection) {
    if (button.textColorSelection === 'custom' && button.customTextColor) {
      const color = button.customTextColor
      textColor = color.alpha
        ? `rgba(${parseInt(color.hex.slice(1, 3), 16)}, ${parseInt(color.hex.slice(3, 5), 16)}, ${parseInt(color.hex.slice(5, 7), 16)}, ${color.alpha})`
        : color.hex
    } else if (button.textColorSelection !== 'custom' && designSystem?.colors) {
      const colorValue = designSystem.colors[button.textColorSelection as keyof typeof designSystem.colors]
      if (colorValue) {
        textColor = designSystemColorToCSS(colorValue)
      }
    }
  } else if (designSystem?.colors?.buttonTextPrimary) {
    // Default to buttonTextPrimary if no text color selection specified
    textColor = designSystemColorToCSS(designSystem.colors.buttonTextPrimary)
  } else if (!textColor && backgroundColor) {
    // Fallback to white text if we have a background color but no design system text color
    textColor = '#ffffff'
  }

  const baseClasses = 'inline-block rounded-lg font-semibold transition-colors px-6 py-3 text-base shadow-xl hover:shadow-2xl'

  // Build style classes based on available colors
  let styleClasses = ''
  if (backgroundColor && textColor) {
    styleClasses = 'hover:opacity-90'
  } else if (backgroundColor) {
    styleClasses = 'text-white hover:opacity-90'
  } else if (textColor) {
    // Use default background with custom text color
    styleClasses = button.style === 'secondary' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-purple-600 hover:bg-purple-700'
  } else {
    // Fallback to hard purple to easily spot missing configuration
    styleClasses = button.style === 'secondary' ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
  }

  const buttonStyle: React.CSSProperties = {}
  if (backgroundColor) buttonStyle.backgroundColor = backgroundColor
  if (textColor) buttonStyle.color = textColor

  return (
    <a
      href={button.url}
      target={button.openInNewTab ? '_blank' : '_self'}
      rel={button.openInNewTab ? 'noopener noreferrer' : undefined}
      className={`${baseClasses} ${styleClasses}`}
      style={buttonStyle}
      data-critical="true"
    >
      {button.text}
    </a>
  )
}
