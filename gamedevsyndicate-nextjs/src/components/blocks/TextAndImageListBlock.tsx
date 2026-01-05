'use client'

import React, { useEffect, useRef, useState } from 'react';
import { getImageUrl } from '../../lib/sanity-image';
import type { SanityImage } from '../../types/sanity';
import RichTextRendererClient from '../RichTextRendererClient';
import type { PortableTextBlock } from '@portabletext/types';
import { resolveColor } from '../../lib/colorUtils';
import type { DesignSystem } from '../../types/designSystem';

interface Article {
  _key: string;
  title: string;
  text: unknown[];
  image?: SanityImage & { alt?: string };
}

interface TextAndImageListBlockProps {
  value: {
    _key: string;
    internalLabel?: string;
    title?: string;
    articles: Article[];
    layout?: 'vertical' | 'horizontal';
    imagePosition?: 'top' | 'left' | 'right' | 'bottom';
    imageAlignment?: boolean;
    imageSize?: 'small' | 'medium' | 'large';
    itemSize?: 'small' | 'medium' | 'large';
    verticalAlignment?: 'start' | 'center' | 'end';
    spacing?: 'compact' | 'normal' | 'relaxed';
    backgroundColorSelection?: string;
    customBackgroundColor?: {
      hex: string;
      alpha?: number;
      rgb: { r: number; g: number; b: number; a: number };
    };
    backgroundOpacityPreset?: string;
    textContainerBackgroundColorSelection?: string;
    customTextContainerBackgroundColor?: {
      hex: string;
      alpha?: number;
      rgb: { r: number; g: number; b: number; a: number };
    };
    textContainerBackgroundOpacityPreset?: string;
  };
  designSystem?: DesignSystem | null;
}

export const TextAndImageListBlock: React.FC<TextAndImageListBlockProps> = ({ value, designSystem }) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const {
    title,
    articles,
    layout = 'vertical',
    imagePosition = 'left',
    imageAlignment = false,
    imageSize = 'medium',
    itemSize = 'small',
    verticalAlignment = 'start',
    spacing = 'normal',
    backgroundColorSelection,
    customBackgroundColor,
    backgroundOpacityPreset,
    textContainerBackgroundColorSelection,
    customTextContainerBackgroundColor,
    textContainerBackgroundOpacityPreset,
  } = value;

  // Set up Intersection Observer for viewport detection
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    itemRefs.current.forEach((ref, index) => {
      if (!ref) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleItems((prev) => new Set(prev).add(index));
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1, // Trigger when 10% visible
          rootMargin: '50px', // Start animation slightly before entering viewport
        }
      );
      
      observer.observe(ref);
      observers.push(observer);
    });
    
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [articles]);

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

  // Resolve text container background color using design system with opacity preset
  const resolveTextContainerBackgroundColor = (): string | undefined => {
    return resolveColor(
      {
        colorSelection: textContainerBackgroundColorSelection as 'primary' | 'secondary' | 'tertiary' | 'buttonPrimary' | 'buttonSecondary' | 'custom' | undefined,
        customColor: customTextContainerBackgroundColor,
        opacityPreset: textContainerBackgroundOpacityPreset,
      },
      designSystem ?? null,
      undefined
    ) || undefined;
  };

  const textContainerBackgroundColor = resolveTextContainerBackgroundColor();

  // Get image size classes - much smaller for list view (40% height reduction total)
  const getImageSizeClasses = () => {
    if (layout === 'horizontal') {
      // For horizontal layout, use fixed small sizes (reduced significantly)
      switch (imageSize) {
        case 'small':
          return 'w-10 h-10 md:w-12 md:h-12';
        case 'medium':
          return 'w-12 h-12 md:w-14 md:h-14';
        case 'large':
          return 'w-14 h-14 md:w-16 md:h-16';
        default:
          return 'w-12 h-12 md:w-14 md:h-14';
      }
    }
    // For vertical layout with left/right position, use itemSize-based widths
    const sizeClasses = getItemSizeClasses();
    return sizeClasses.imageWidth || 'md:w-32';
  };

  // Get content size classes (complement of image size)
  const getContentSizeClasses = () => {
    return 'flex-1'; // Let content take remaining space
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

  // Get spacing classes (40% reduction total)
  const getSpacingClasses = () => {
    switch (spacing) {
      case 'compact':
        return 'gap-1.5 md:gap-2';
      case 'normal':
        return 'gap-3 md:gap-4';
      case 'relaxed':
        return 'gap-4 md:gap-6';
      default:
        return 'gap-3 md:gap-4';
    }
  };

  // Get item size classes (only applies to vertical layout when image is top/bottom)
  const getItemSizeClasses = () => {
    if (layout === 'horizontal') {
      return { imageHeight: '', imageWidth: '', contentPadding: '' };
    }

    // On mobile: moderately reduced height for all positions
    // On desktop: full height for top/bottom, auto height for left/right
    const isTopBottom = imagePosition === 'top' || imagePosition === 'bottom';

    switch (itemSize) {
      case 'small':
        return {
          imageHeight: isTopBottom ? '!h-26 md:!h-32' : '!h-26 md:!h-auto',
          imageWidth: 'w-full md:w-32',
          contentPadding: 'p-3 md:p-4'
        };
      case 'medium':
        return {
          imageHeight: isTopBottom ? '!h-36 md:!h-48' : '!h-36 md:!h-auto',
          imageWidth: 'w-full md:w-48',
          contentPadding: 'p-4 md:p-6'
        };
      case 'large':
        return {
          imageHeight: isTopBottom ? '!h-48 md:!h-64' : '!h-48 md:!h-auto',
          imageWidth: 'w-full md:w-64',
          contentPadding: 'p-5 md:p-8'
        };
      default:
        return {
          imageHeight: isTopBottom ? '!h-26 md:!h-32' : '!h-26 md:!h-auto',
          imageWidth: 'w-full md:w-32',
          contentPadding: 'p-3 md:p-4'
        }
    }
  };

  // Determine which side image should be on (for left/right positions)
  const getItemImageSide = (index: number): 'left' | 'right' => {
    // For top/bottom positions, side doesn't matter
    if (imagePosition === 'top' || imagePosition === 'bottom') {
      return 'left';
    }
    
    // For right position
    if (imagePosition === 'right') {
      // If alternating is enabled, swap sides
      if (imageAlignment) {
        return index % 2 === 0 ? 'right' : 'left';
      }
      return 'right';
    }
    
    // For left position (default)
    if (imageAlignment) {
      return index % 2 === 0 ? 'left' : 'right';
    }
    return 'left';
  };

  // Render a single item
  const renderArticle = (article: Article, index: number) => {
    // Generate two different image URLs - panoramic for mobile, standard for desktop
    const mobileImageUrl = article.image 
      ? getImageUrl(article.image, 800, 300, { fit: 'crop' })
      : null;
    const desktopImageUrl = article.image 
      ? getImageUrl(article.image, 400, 600, { fit: 'crop' })
      : null;
    const articleImageSide = getItemImageSide(index);
    const sizeClasses = getItemSizeClasses();
    const isVisible = visibleItems.has(index);
    
    const articleStyle: React.CSSProperties = backgroundColor
      ? { backgroundColor }
      : {};

    // Add animation direction based on image side (only for left/right positions)
    const animationClass = (imagePosition === 'left' || imagePosition === 'right') 
      ? (articleImageSide === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right')
      : '';

    const articleClasses = `
      rounded-lg
      overflow-hidden
      shadow-2xl
      ${backgroundColor ? '' : 'bg-gray-800/30 backdrop-blur-sm'}
      ${layout === 'horizontal' ? 'flex-shrink-0 w-72' : 'w-full'}
      ${isVisible ? animationClass : 'opacity-0'}
    `.trim().replace(/\s+/g, ' ');
    
    // If no image, render simple text-only layout
    if (!mobileImageUrl && !desktopImageUrl) {
      return (
        <div 
          key={article._key}
          ref={(el) => { itemRefs.current[index] = el; }}
          className={articleClasses} 
          style={articleStyle}
        >
          <div className={`flex flex-col gap-1 ${sizeClasses.contentPadding || 'p-2 md:p-3'}`}>
            <h3 className="text-xs font-bold text-white line-clamp-2 text-left">
              {article.title}
            </h3>
            {article.text && article.text.length > 0 && (
              <div className="prose prose-sm max-w-none text-gray-300 line-clamp-2 text-xs leading-tight text-left">
                <RichTextRendererClient value={article.text as PortableTextBlock[]} />
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Determine layout based on image position
    let containerClasses = '';
    if (imagePosition === 'top') {
      containerClasses = `flex flex-col gap-2 md:gap-4 ${getAlignmentClasses()}`;
    } else if (imagePosition === 'bottom') {
      containerClasses = `flex flex-col-reverse gap-2 md:gap-4 ${getAlignmentClasses()}`;
    } else if (imagePosition === 'right' || articleImageSide === 'right') {
      containerClasses = `flex flex-col gap-2 md:flex-row-reverse md:gap-6 ${getAlignmentClasses()}`;
    } else {
      containerClasses = `flex flex-col gap-2 md:flex-row md:gap-6 ${getAlignmentClasses()}`;
    }

    const isHorizontalImage = imagePosition === 'top' || imagePosition === 'bottom';

    return (
      <div 
        key={article._key}
        ref={(el) => { itemRefs.current[index] = el; }}
        className={articleClasses} 
        style={articleStyle}
      >
        <div className={containerClasses}>
          {/* Image - no padding, extends to edges */}
          <div className={`w-full ${isHorizontalImage ? '' : sizeClasses.imageWidth || 'md:w-32'} flex-shrink-0`}>
            {/* Use picture element for responsive images */}
            <picture>
              <source media="(min-width: 768px)" srcSet={desktopImageUrl || ''} />
              <img
                src={mobileImageUrl || ''}
                alt={article.image?.alt || article.title || 'Content image'}
                className={`w-full object-cover object-center ${sizeClasses.imageHeight || '!h-26 md:!h-auto'}`}
              />
            </picture>
          </div>

          {/* Content - with padding and background */}
          <div 
            className={`w-full ${isHorizontalImage ? '' : 'md:flex-1'} flex flex-col justify-start gap-1 md:gap-2 ${sizeClasses.contentPadding || 'p-3 md:p-4'} ${textContainerBackgroundColor ? '' : 'bg-gray-900/80'} backdrop-blur-sm rounded-lg`}
            style={textContainerBackgroundColor ? { backgroundColor: textContainerBackgroundColor } : undefined}
          >
            <h3 className="text-lg font-bold text-white text-left">
              {article.title}
            </h3>
            
            {article.text && article.text.length > 0 && (
              <div className="prose prose-base max-w-none text-gray-300 text-base text-left">
                <RichTextRendererClient value={article.text as PortableTextBlock[]} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Section Title */}
      {title && (
        <h2 className="text-base md:text-lg font-bold mb-2 text-white text-center">
          {title}
        </h2>
      )}

      {/* Content Items Container */}
      {layout === 'horizontal' ? (
        <div className="overflow-x-auto -mx-2 px-2 pb-2">
          <div className={`flex ${getSpacingClasses()}`}>
            {articles.map((article, index) => renderArticle(article, index))}
          </div>
        </div>
      ) : (
        <div className={`flex flex-col ${getSpacingClasses()}`}>
          {articles.map((article, index) => renderArticle(article, index))}
        </div>
      )}
    </div>
  );
};
