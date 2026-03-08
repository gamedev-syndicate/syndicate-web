'use client'

import React from 'react';
import { designSystemColorToCSS } from '../../lib/background-utils';
import type { DesignSystem } from '../../types/designSystem';

interface SanityColor {
  _type: 'color';
  alpha?: number;
  hex: string;
  hsl?: Record<string, unknown>;
  hsv?: Record<string, unknown>;
  rgb?: Record<string, unknown>;
}

interface ContentSeparatorBlockProps {
  // Design system color fields
  lineColorSelection?: string;
  customLineColor?: SanityColor;
  diamondColorSelection?: string;
  customDiamondColor?: SanityColor;
  // Legacy color fields for backward compatibility
  lineColor?: SanityColor;
  diamondColor?: SanityColor;
  strokeWidth?: number;
  height?: string;
  margin?: {
    top?: string;
    bottom?: string;
  };
  designSystem?: DesignSystem | null;
}

const getColorValue = (color?: SanityColor): string => {
  if (!color?.hex) {
    return '#FFFFFF3D'; // Default fallback
  }
  
  if (color.alpha !== undefined && color.alpha < 1) {
    // Convert to hex with alpha
    const alphaHex = Math.floor(color.alpha * 255).toString(16).padStart(2, '0');
    return `${color.hex}${alphaHex}`;
  }
  
  return color.hex;
};

const ContentSeparatorBlock: React.FC<ContentSeparatorBlockProps> = ({
  lineColorSelection,
  customLineColor,
  diamondColorSelection,
  customDiamondColor,
  lineColor, // Legacy fallback
  diamondColor, // Legacy fallback
  strokeWidth = 0.4,
  height = '24px',
  margin = { top: '2rem', bottom: '2rem' },
  designSystem,
}) => {
  
  const resolveColor = (
    colorSelection?: string,
    customColor?: SanityColor,
    legacyColor?: SanityColor,
    fallback: string = '#FFFFFF3D'
  ): string => {
    // Try design system colors first
    if (colorSelection) {
      if (colorSelection === 'custom' && customColor) {
        return getColorValue(customColor);
      } else if (colorSelection !== 'custom' && designSystem?.colors) {
        const colorValue = designSystem.colors[colorSelection as keyof typeof designSystem.colors];
        if (colorValue) {
          return designSystemColorToCSS(colorValue);
        }
      }
    }
    
    // Fallback to legacy color
    if (legacyColor) {
      return getColorValue(legacyColor);
    }
    
    // Final fallback
    return fallback;
  };
  
  const lineColorValue = resolveColor(lineColorSelection, customLineColor, lineColor);
  const diamondColorValue = resolveColor(diamondColorSelection, customDiamondColor, diamondColor);

  const containerStyle: React.CSSProperties = {
    marginTop: margin?.top || '2rem',
    marginBottom: margin?.bottom || '2rem',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: height,
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const lineStyle: React.CSSProperties = {
    flex: 1,
    height: `${strokeWidth}px`,
    backgroundColor: lineColorValue,
    borderRadius: '2px',
  };

  const diamondStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    backgroundColor: diamondColorValue,
    transform: 'rotate(45deg)',
    margin: '0 20px',
    flexShrink: 0,
  };

  return (
    <div style={containerStyle}>
      <div style={lineStyle}></div>
      <div style={diamondStyle}></div>
      <div style={lineStyle}></div>
    </div>
  );
};

export default ContentSeparatorBlock;