'use client'

import React, { useState, useEffect, useRef } from 'react';
import { getImageUrl } from '../lib/sanity-image';
import type { SanityImage } from '../types/sanity';
import { HoneycombGrid } from './HoneycombGrid';
import { TiltedSquareGrid } from './TiltedSquareGrid';
import HeroGrid from './HeroGrid';
import { colorToCSS } from '../lib/colorUtils';
import type { DesignSystem } from '../types/designSystem';

interface CompanyData {
  _id: string;
  name: string;
  logo?: SanityImage & {
    alt?: string;
  };
  nameIncludedInLogo?: boolean;
  heroImage?: SanityImage & {
    alt?: string;
  };
  ceoName?: string;
  email?: string;
  description?: string;
}


interface CompanyBlockProps {
  value: {
    company: CompanyData;
    layout?: 'card' | 'horizontal' | 'minimal';
  };
  designSystem?: DesignSystem | null;
}

interface CompanyListBlockProps {
  value: {
    title?: string;
    companies: CompanyData[];
    alternateImagePosition?: boolean;
    logoBlendMode?: string;
    backgroundColorSelection?: string;
    customBackgroundColor?: { hex: string; alpha?: number; rgb: { r: number; g: number; b: number; a: number } };
    borderColorSelection?: string;
    customBorderColor?: { hex: string; alpha?: number; rgb: { r: number; g: number; b: number; a: number } };
    // Legacy support for backward compatibility
    backgroundColor?: { hex: string; alpha?: number };
    borderColor?: { hex: string; alpha?: number };
  };
  designSystem?: DesignSystem | null;
}

const CompanyCard: React.FC<{
  company: CompanyData;
  layout: 'card' | 'horizontal' | 'minimal';
  showDescription?: boolean;
  showCEO?: boolean;
  showEmail?: boolean;
  logoBlendMode?: string;
  backgroundColor?: { hex: string; alpha?: number };
  borderColor?: { hex: string; alpha?: number };
}> = ({ company, layout, showDescription = true, showCEO = true, showEmail = false, logoBlendMode = 'normal', backgroundColor, borderColor }) => {
  const logoUrl = company.logo ? getImageUrl(company.logo, 220, 220) : null;

  const backgroundStyle = backgroundColor 
    ? { backgroundColor: backgroundColor.hex }
    : {};

  const borderStyle = borderColor 
    ? { borderColor: borderColor.hex }
    : {};

  const isLightBackground = backgroundColor 
    ? getLuminance(backgroundColor.hex) > 0.5 
    : false; // Default to dark theme

  const textColorClass = isLightBackground ? 'text-gray-900' : 'text-white';
  const subTextColorClass = isLightBackground ? 'text-gray-600' : 'text-gray-300';
  const cardBgClass = backgroundColor ? '' : 'bg-gray-800/30';
  const borderClass = borderColor ? 'border' : 'border border-gray-700/50';

  if (layout === 'minimal') {
    return (
      <div 
        className={`flex items-center space-x-4 p-4 rounded-lg backdrop-blur-sm ${cardBgClass} ${borderClass}`}
        style={{...backgroundStyle, ...borderStyle}}
      >
        {logoUrl && (
          <img
            src={logoUrl}
            alt={company.logo?.alt || `${company.name} logo`}
            className="w-[4.4rem] h-[4.4rem] object-contain rounded"
            style={{ mixBlendMode: logoBlendMode as React.CSSProperties['mixBlendMode'] }}
          />
        )}
        <div>
          <h3 className={`text-lg font-semibold ${textColorClass}`}>{company.name}</h3>
          {showCEO && company.ceoName && (
            <p className={`text-sm ${subTextColorClass}`}>CEO: {company.ceoName}</p>
          )}
        </div>
      </div>
    );
  }

  if (layout === 'horizontal') {
    return (
      <div 
        className={`flex items-start space-x-6 p-6 rounded-lg backdrop-blur-sm ${cardBgClass} ${borderClass}`}
        style={{...backgroundStyle, ...borderStyle}}
      >
        {logoUrl && (
          <img
            src={logoUrl}
            alt={company.logo?.alt || `${company.name} logo`}
            className="w-[6.6rem] h-[6.6rem] object-contain rounded flex-shrink-0"
            style={{ mixBlendMode: logoBlendMode as React.CSSProperties['mixBlendMode'] }}
          />
        )}
        <div className="flex-1">
          <h3 className={`text-xl font-bold mb-2 ${textColorClass}`}>{company.name}</h3>
          {showCEO && company.ceoName && (
            <p className={`mb-2 ${subTextColorClass}`}>
              <span className="font-semibold">CEO:</span> {company.ceoName}
            </p>
          )}
          {showEmail && company.email && (
            <p className="text-blue-400 mb-2">
              <a href={`mailto:${company.email}`} className="hover:underline">
                {company.email}
              </a>
            </p>
          )}
          {showDescription && company.description && (
            <p className={`leading-relaxed ${subTextColorClass}`}>{company.description}</p>
          )}
        </div>
      </div>
    );
  }

  // Default card layout
  return (
    <div 
      className={`rounded-lg p-6 backdrop-blur-sm text-center ${cardBgClass} ${borderClass}`}
      style={{...backgroundStyle, ...borderStyle}}
    >
      {logoUrl && (
        <img
          src={logoUrl}
          alt={company.logo?.alt || `${company.name} logo`}
          className="w-[8.8rem] h-[8.8rem] object-contain rounded mx-auto mb-4"
          style={{ mixBlendMode: logoBlendMode as React.CSSProperties['mixBlendMode'] }}
        />
      )}
      <h3 className={`text-xl font-bold mb-2 ${textColorClass}`}>{company.name}</h3>
      {showCEO && company.ceoName && (
        <p className={`mb-2 ${subTextColorClass}`}>
          <span className="font-semibold">CEO:</span> {company.ceoName}
        </p>
      )}
      {showEmail && company.email && (
        <p className="text-blue-400 mb-3">
          <a href={`mailto:${company.email}`} className="hover:underline">
            {company.email}
          </a>
        </p>
      )}
      {showDescription && company.description && (
        <p className={`leading-relaxed ${subTextColorClass}`}>{company.description}</p>
      )}
    </div>
  );
};

export const CompanyBlock: React.FC<CompanyBlockProps> = ({ value, designSystem }) => {
  if (!value.company) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <CompanyCard 
        company={value.company} 
        layout={value.layout || 'card'} 
      />
    </div>
  );
};

export const CompanyListBlock: React.FC<CompanyListBlockProps> = ({ value, designSystem }) => {
  const { 
    title, 
    companies,
    alternateImagePosition = false,
    logoBlendMode = 'normal',
    backgroundColorSelection,
    customBackgroundColor,
    // Legacy support
    backgroundColor: legacyBackgroundColor
  } = value;

  // Animation state management
  const [visibleCompanies, setVisibleCompanies] = useState<Set<number>>(new Set());
  const companyRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Set up Intersection Observer for scroll animations
  useEffect(() => {
    if (!companies || companies.length === 0) return;
    
    const observers: IntersectionObserver[] = [];
    
    companyRefs.current.forEach((ref, index) => {
      if (!ref) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCompanies((prev) => new Set(prev).add(index));
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '50px',
        }
      );
      
      observer.observe(ref);
      observers.push(observer);
    });
    
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [companies]);

  // Helper function to resolve color and convert to expected format
  const resolveColorToObject = (
    colorSelection?: string,
    customColor?: { hex: string; alpha?: number; rgb: { r: number; g: number; b: number; a: number } },
    legacyColor?: { hex: string; alpha?: number }
  ): { hex: string; alpha?: number } | undefined => {
    if (colorSelection && colorSelection !== 'custom' && designSystem?.colors) {
      const colorValue = designSystem.colors[colorSelection as keyof typeof designSystem.colors];
      if (colorValue) {
        return { hex: colorToCSS(colorValue), alpha: 1 };
      }
    }
    
    if (colorSelection === 'custom' && customColor) {
      return { 
        hex: customColor.hex, 
        alpha: customColor.alpha ?? 1 
      };
    }
    
    return legacyColor;
  };

  // Resolve colors using design system
  const finalBackgroundColor = resolveColorToObject(
    backgroundColorSelection,
    customBackgroundColor,
    legacyBackgroundColor
  );

  // Early return after all hooks
  if (!companies || companies.length === 0) {
    return null;
  }

  // Render a single company
  const renderCompany = (company: CompanyData, index: number) => {
    // Let Sanity auto-detect format to preserve transparency
    const logoUrl = company.logo ? getImageUrl(company.logo, 400, 400, {
      fit: 'max' // Preserve aspect ratio and transparency
    }) : null;
    
    // Determine image position: alternate between left and right when enabled
    const isImageRight = alternateImagePosition && index % 2 === 1;
    
    // Animation classes
    const isVisible = visibleCompanies.has(index);
    const animationClass = 'animate-fadeIn';
    
    const companyStyle: React.CSSProperties = finalBackgroundColor
      ? { backgroundColor: finalBackgroundColor.hex }
      : {};

    const companyClasses = `
      rounded-lg
      overflow-hidden
      ${finalBackgroundColor ? '' : 'bg-gray-800/30 backdrop-blur-sm'}
      w-full
      ${isVisible ? animationClass : 'opacity-0'}
    `.trim().replace(/\s+/g, ' ');
    
    // If no logo, render simple text-only layout
    if (!logoUrl) {
      return (
        <div 
          key={`${company._id}-${index}`} 
          ref={(el) => { companyRefs.current[index] = el; }}
          className={companyClasses} 
          style={companyStyle}
        >
          <div className="flex flex-col gap-0.5 p-3 md:p-4 text-left max-h-36 md:max-h-44 overflow-hidden">
            <h3 className="text-lg md:text-xl font-bold text-white text-left" style={{ textAlign: 'left', marginBottom: 0 }}>
              {company.name}
            </h3>
            {(company.ceoName || company.email) && (
              <p className="text-sm text-gray-300 text-left" style={{ textAlign: 'left', marginBottom: 0 }}>
                {company.ceoName && (
                  <><span className="font-semibold">CEO:</span> {company.ceoName}</>
                )}
                {company.ceoName && company.email && <span> | </span>}
                {company.email && (
                  <a 
                    href={`mailto:${company.email}`} 
                    className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                  >
                    {company.email}
                  </a>
                )}
              </p>
            )}
            {company.description && (
              <p className="text-sm text-gray-300 leading-relaxed text-left line-clamp-4" style={{ textAlign: 'left', marginBottom: 0, marginTop: '0.25rem' }}>
                {company.description}
              </p>
            )}
          </div>
        </div>
      );
    }
    
    // Layout with logo on left or right
    const containerClasses = isImageRight
      ? `flex flex-row-reverse items-start`
      : `flex flex-row items-start`;

    return (
      <div 
        key={`${company._id}-${index}`} 
        ref={(el) => { companyRefs.current[index] = el; }}
        className={companyClasses} 
        style={companyStyle}
      >
        <div className={containerClasses}>
          {/* Logo - no padding, preserves transparency */}
          <div className="w-36 md:w-44 flex-shrink-0">
            <img
              src={logoUrl}
              alt={company.logo?.alt || `${company.name} logo`}
              className="w-full h-full object-contain"
              style={{ mixBlendMode: logoBlendMode as React.CSSProperties['mixBlendMode'] }}
            />
          </div>

          {/* Content - aligned to top, no top padding */}
          <div className="flex-1 flex flex-col items-start gap-0.5 pl-3 md:pl-4 pr-3 md:pr-4 pb-3 md:pb-4 text-left max-h-36 md:max-h-44 overflow-hidden">
            <h3 className="text-lg md:text-xl font-bold text-white w-full text-left" style={{ textAlign: 'left', marginBottom: 0 }}>
              {company.name}
            </h3>
            
            {(company.ceoName || company.email) && (
              <p className="text-sm text-gray-300 w-full text-left" style={{ textAlign: 'left', marginBottom: 0 }}>
                {company.ceoName && (
                  <><span className="font-semibold">CEO:</span> {company.ceoName}</>
                )}
                {company.ceoName && company.email && <span> | </span>}
                {company.email && (
                  <a 
                    href={`mailto:${company.email}`} 
                    className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                  >
                    {company.email}
                  </a>
                )}
              </p>
            )}
            
            {company.description && (
              <p className="text-sm text-gray-300 leading-relaxed w-full text-left line-clamp-4" style={{ textAlign: 'left', marginBottom: 0, marginTop: '0.25rem' }}>
                {company.description}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Section Title */}
      {title && (
        <h2 className="text-base md:text-lg font-bold mb-2 text-white text-center">
          {title}
        </h2>
      )}

      {/* Companies Container */}
      <div className="flex flex-col gap-2 md:gap-3 max-w-2xl mx-auto">
        {companies.map((company, index) => renderCompany(company, index))}
      </div>
    </div>
  );
};

// CompactCompanyListBlock: Shows all companies with layout options (grid, list, carousel, honeycomb, tiltedsquare, heroGrid)
interface CompactCompanyListBlockProps {
  value: {
    title?: string;
    companies: CompanyData[];
    layout?: 'grid' | 'list' | 'carousel' | 'honeycomb' | 'tiltedsquare' | 'heroGrid';
    maxItemsPerRow?: number;
    logoBlendMode?: string;
    backgroundColorSelection?: string;
    customBackgroundColor?: { hex: string; alpha?: number; rgb: { r: number; g: number; b: number; a: number } };
    borderColorSelection?: string;
    customBorderColor?: { hex: string; alpha?: number; rgb: { r: number; g: number; b: number; a: number } };
    // Legacy support
    backgroundColor?: { hex: string; alpha?: number };
    borderColor?: { hex: string; alpha?: number };
  };
  designSystem?: DesignSystem | null;
}

export const CompactCompanyListBlock: React.FC<CompactCompanyListBlockProps> = ({ value, designSystem }) => {
  const { 
    title, 
    companies, 
    layout = 'grid',
    maxItemsPerRow,
    logoBlendMode = 'normal',
    backgroundColorSelection,
    customBackgroundColor,
    borderColorSelection,
    customBorderColor,
    backgroundColor: legacyBackgroundColor,
    borderColor: legacyBorderColor
  } = value;

  if (!companies || companies.length === 0) {
    return null;
  }

  // Helper function to resolve color and convert to expected format
  const resolveColorToObject = (
    colorSelection?: string,
    customColor?: { hex: string; alpha?: number; rgb: { r: number; g: number; b: number; a: number } },
    legacyColor?: { hex: string; alpha?: number }
  ): { hex: string; alpha?: number } | undefined => {
    if (colorSelection && colorSelection !== 'custom' && designSystem?.colors) {
      const colorValue = designSystem.colors[colorSelection as keyof typeof designSystem.colors];
      if (colorValue) {
        return { hex: colorToCSS(colorValue), alpha: 1 };
      }
    }
    
    if (colorSelection === 'custom' && customColor) {
      return { 
        hex: customColor.hex, 
        alpha: customColor.alpha ?? 1 
      };
    }
    
    return legacyColor;
  };

  const finalBackgroundColor = resolveColorToObject(
    backgroundColorSelection,
    customBackgroundColor,
    legacyBackgroundColor
  );

  const finalBorderColor = resolveColorToObject(
    borderColorSelection,
    customBorderColor,
    legacyBorderColor
  );

  const isLightBackground = finalBackgroundColor 
    ? getLuminance(finalBackgroundColor.hex) > 0.5 
    : false;

  const textColorClass = isLightBackground ? 'text-gray-900' : 'text-white';

  const getGridClasses = () => {
    switch (layout) {
      case 'list':
        return 'space-y-4';
      case 'carousel':
        return 'flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900';
      case 'honeycomb':
        return 'honeycomb-grid';
      case 'tiltedsquare':
        return '';
      case 'heroGrid':
        return '';
      default: // grid
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {title && (
        <h2 className={`text-3xl font-bold mb-8 text-center ${textColorClass}`}>{title}</h2>
      )}
      <div className={getGridClasses()}>
        {layout === 'honeycomb' ? (
          <HoneycombGrid
            companies={companies}
            maxItemsPerRow={maxItemsPerRow}
            logoBlendMode={logoBlendMode}
            backgroundColor={finalBackgroundColor}
            borderColor={finalBorderColor}
          />
        ) : layout === 'tiltedsquare' ? (
          <TiltedSquareGrid
            companies={companies}
            maxItemsPerRow={maxItemsPerRow}
            logoBlendMode={logoBlendMode}
            backgroundColor={finalBackgroundColor}
            borderColor={finalBorderColor}
          />
        ) : layout === 'heroGrid' ? (
          <HeroGrid
            companies={companies}
            maxItemsPerRow={maxItemsPerRow}
            logoBlendMode={logoBlendMode}
            backgroundColor={finalBackgroundColor}
            borderColor={finalBorderColor}
          />
        ) : (
          companies.map((company, index) => (
            <div 
              key={`${company._id}-${index}`}
              className={layout === 'carousel' ? 'flex-shrink-0 w-80' : ''}
            >
              <CompanyCard
                company={company}
                layout={layout === 'list' ? 'horizontal' : 'card'}
                showDescription={false}
                showCEO={false}
                showEmail={false}
                logoBlendMode={logoBlendMode}
                backgroundColor={finalBackgroundColor}
                borderColor={finalBorderColor}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

function getLuminance(hex: string): number {
  const rgb = hex.replace('#', '');
  const r = parseInt(rgb.substr(0, 2), 16) / 255;
  const g = parseInt(rgb.substr(2, 2), 16) / 255;
  const b = parseInt(rgb.substr(4, 2), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}
