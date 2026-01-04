'use client'

import React from 'react';
import { getImageUrl } from '../../lib/sanity-image';
import type { SanityImage } from '../../types/sanity';
import { resolveColor } from '../../lib/colorUtils';
import RichTextRendererClient from '../RichTextRendererClient';
import type { PortableTextBlock } from '@portabletext/types';
import type { DesignSystem } from '../../types/designSystem';

interface ImageTextBlockProps {
  value: {
    _key: string;
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
    backgroundOpacityPreset?: string;
    verticalAlignment?: 'start' | 'center' | 'end';
  };
  designSystem?: DesignSystem | null;
}

export const ImageTextBlock: React.FC<ImageTextBlockProps> = ({ value, designSystem }) => {
  const {
    title,
    image,
    text,
    imagePosition = 'left',
    imageSize = 'medium',
    backgroundColorSelection,
    customBackgroundColor,
    backgroundOpacityPreset,
    verticalAlignment = 'center',
  } = value;

  // Resolve background color using design system with opacity preset
  const resolveBackgroundColor = (): string | undefined => {
    return resolveColor(
      {
        colorSelection: backgroundColorSelection as 'primary' | 'secondary' | 'tertiary' | 'buttonPrimary' | 'buttonSecondary' | 'custom' | undefined,
        customColor: customBackgroundColor,
        opacityPreset: backgroundOpacityPreset,
      },
      designSystem ?? null,
      undefined
    ) || undefined;
  };

  const backgroundColor = resolveBackgroundColor();
  const isLightBackground = backgroundColor ? getLuminance(backgroundColor) > 0.5 : false;
  
  const textColorClass = isLightBackground ? 'text-gray-900' : 'text-white';
  const subTextColorClass = isLightBackground ? 'text-gray-700' : 'text-gray-300';

  // Get image size classes
  const getImageSizeClasses = () => {
    switch (imageSize) {
      case 'small':
        return 'md:w-1/4';
      case 'medium':
        return 'md:w-1/3';
      case 'large':
        return 'md:w-2/5';
      case 'half':
        return 'md:w-1/2';
      default:
        return 'md:w-1/3';
    }
  };

  // Get content size classes (complement of image size)
  const getContentSizeClasses = () => {
    switch (imageSize) {
      case 'small':
        return 'md:w-3/4';
      case 'medium':
        return 'md:w-2/3';
      case 'large':
        return 'md:w-3/5';
      case 'half':
        return 'md:w-1/2';
      default:
        return 'md:w-2/3';
    }
  };

  // Get vertical alignment classes
  const getAlignmentClasses = () => {
    switch (verticalAlignment) {
      case 'start':
        return 'items-start';
      case 'center':
        return 'items-center';
      case 'end':
        return 'items-end';
      default:
        return 'items-center';
    }
  };

  const imageUrl = image ? getImageUrl(image, 800, 800) : null;

  const containerStyle: React.CSSProperties = backgroundColor
    ? { backgroundColor }
    : {};

  const containerClasses = `
    w-full
    p-6 md:p-8 lg:p-10
    rounded-lg
    ${backgroundColor ? '' : 'bg-gray-800/30 backdrop-blur-sm'}
  `.trim().replace(/\s+/g, ' ');

  const flexDirection = imagePosition === 'right' ? 'flex-row-reverse' : 'flex-row';

  return (
    <div className={containerClasses} style={containerStyle} data-critical="true">
      <div className={`flex flex-col md:${flexDirection} gap-6 md:gap-8 ${getAlignmentClasses()}`}>
        {/* Image Column */}
        {imageUrl && (
          <div className={`w-full ${getImageSizeClasses()} flex-shrink-0`}>
            <img
              src={imageUrl}
              alt={image?.alt || title || 'Image'}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Content Column */}
        <div className={`w-full ${getContentSizeClasses()} flex-shrink-0`}>
          {title && (
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${textColorClass}`}>
              {title}
            </h2>
          )}
          
          {text && text.length > 0 && (
            <div className={`prose prose-xl max-w-none ${subTextColorClass}`}>
              <RichTextRendererClient value={text as PortableTextBlock[]} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate luminance
function getLuminance(hex: string): number {
  const rgb = hex.replace('#', '');
  const r = parseInt(rgb.substr(0, 2), 16) / 255;
  const g = parseInt(rgb.substr(2, 2), 16) / 255;
  const b = parseInt(rgb.substr(4, 2), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}
