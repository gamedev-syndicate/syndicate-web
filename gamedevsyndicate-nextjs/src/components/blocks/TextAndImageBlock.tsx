'use client'

import React from 'react';
import { getImageUrl } from '../../lib/sanity-image';
import type { SanityImage } from '../../types/sanity';
import RichTextRendererClient from '../RichTextRendererClient';
import type { PortableTextBlock } from '@portabletext/types';

interface TextAndImageBlockProps {
  value: {
    _key: string;
    article: {
      _id: string;
      title: string;
      text: unknown[];
      image?: SanityImage & { alt?: string };
    };
    imageAlignment?: 'left' | 'right';
    imageSize?: 'small' | 'medium' | 'large';
    verticalAlignment?: 'start' | 'center' | 'end';
    textAlign?: 'left' | 'center' | 'right';
  };
}

export const TextAndImageBlock: React.FC<TextAndImageBlockProps> = ({ value }) => {
  const {
    article,
    imageAlignment = 'left',
    imageSize = 'medium',
    verticalAlignment = 'start',
    textAlign = 'left',
  } = value;

  if (!article) {
    return null;
  }

  const { title, text, image } = article;
  const imageUrl = image ? getImageUrl(image, 400, 400) : null;

  if (!imageUrl) {
    // Render text-only layout
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col">
          <h2 className={`text-2xl md:text-4xl font-bold mb-3 text-white ${textAlign === 'left' ? 'text-left' : textAlign === 'center' ? 'text-center' : 'text-right'}`}>
            {title}
          </h2>
          
          {text && text.length > 0 && (
            <div className={`prose prose-xl max-w-none text-gray-300 ${textAlign === 'left' ? 'text-left' : textAlign === 'center' ? 'text-center' : 'text-right'}`}>
              <RichTextRendererClient value={text as PortableTextBlock[]} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Get image size classes
  const getImageSizeClasses = () => {
    switch (imageSize) {
      case 'small':
        return 'md:w-1/5'; // 20%
      case 'medium':
        return 'md:w-[30%]'; // 30%
      case 'large':
        return 'md:w-2/5'; // 40%
      default:
        return 'md:w-[30%]';
    }
  };

  // Get content size classes (complement of image size)
  const getContentSizeClasses = () => {
    switch (imageSize) {
      case 'small':
        return 'md:w-4/5'; // 80%
      case 'medium':
        return 'md:w-[70%]'; // 70%
      case 'large':
        return 'md:w-3/5'; // 60%
      default:
        return 'md:w-[70%]';
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
        return 'items-start';
    }
  };

  // Build proper class names for Tailwind (can't use template literals with breakpoints)
  // On mobile: always image on top (flex-col), on desktop: respect imageAlignment
  const containerClasses = imageAlignment === 'right'
    ? `flex flex-col md:flex-row-reverse gap-6 md:gap-6 ${getAlignmentClasses()}`
    : `flex flex-col md:flex-row gap-6 md:gap-6 ${getAlignmentClasses()}`;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className={containerClasses}>
        {/* Image Column - Always on top on mobile */}
        {imageUrl && (
          <div className={`w-1/2 mx-auto md:w-full md:mx-0 ${getImageSizeClasses()} flex-shrink-0`}>
            <img
              src={imageUrl}
              alt={image?.alt || title || 'Content image'}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Content Column */}
        <div className={`w-full ${getContentSizeClasses()} flex-shrink-0 flex flex-col`}>
          <h2 className={`text-2xl md:text-4xl font-bold mb-3 text-white ${textAlign === 'left' ? 'text-left' : textAlign === 'center' ? 'text-center' : 'text-right'}`}>
            {title}
          </h2>
          
          {text && text.length > 0 && (
            <div className={`prose prose-xl max-w-none text-gray-300 ${textAlign === 'left' ? 'text-left' : textAlign === 'center' ? 'text-center' : 'text-right'}`}>
              <RichTextRendererClient value={text as PortableTextBlock[]} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
