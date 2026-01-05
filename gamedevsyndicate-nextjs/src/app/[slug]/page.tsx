import { notFound } from 'next/navigation';
import DynamicStyles from '../../components/DynamicStyles';
import SvgOverlay from '../../components/SvgOverlay';
import CustomBlocks from '../../components/CustomBlocks';
import { AnimatedHomepageSection } from '../../components/AnimatedHomepageSection';
import { getPage, getSiteConfig, getDesignSystem, getAllPageSlugs } from '../../lib/sanity-queries';
import { sanityColorToCSS, generateSectionBackgroundStyle } from '../../lib/background-utils';
import { getImageUrl } from '../../lib/sanity-image';
import bannerStyles from '../banner.module.css';
import type { Metadata } from 'next';

// Revalidate this page every 5 minutes in production
export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const page = await getPage(resolvedParams.slug);
  
  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }
  
  return {
    title: page.metaTitle || page.title || 'GameDev Syndicate',
    description: page.metaDescription || `${page.title || 'Page'} - GameDev Syndicate`,
  };
}

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const page = await getPage(resolvedParams.slug);
  const siteConfig = await getSiteConfig();
  const designSystem = await getDesignSystem();
  
  if (!page) {
    notFound();
  }

  console.log('Design system fetched:', designSystem);
  
  // Handle menu color with design system support
  let menuColor = siteConfig?.menuColor?.hex || 'rgba(0,0,0,0.6)';
  
  if (siteConfig?.menuColorSelection) {
    if (siteConfig.menuColorSelection !== 'custom') {
      // Use design system colors
      if (designSystem?.colors) {
        const colorValue = designSystem.colors[siteConfig.menuColorSelection as keyof typeof designSystem.colors];
        if (colorValue?.hex) {
          menuColor = colorValue.hex;
        }
      }
    } else if (siteConfig.customMenuColor) {
      // Use custom color
      menuColor = siteConfig.customMenuColor.hex;
    }
  }
  
  // Only apply background if page specifically has one set
  const pageBackgroundStyle = page.backgroundColor 
    ? { background: sanityColorToCSS(page.backgroundColor) }
    : {}; // No background - let layout background show through

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        width: '100vw',
        gap: 0,
      }}
    >
      <DynamicStyles menuColor={menuColor} />
      
      {/* Global SVG Overlay for pages */}
      <SvgOverlay 
        overlayTexture={siteConfig?.overlayTexture} 
        backgroundConfig={siteConfig?.pageBackground}
        isSection={false} 
      />
      
      {/* Page Header and Main Content Area */}
      <div 
        style={{
          ...pageBackgroundStyle,
          width: '100%',
        }} 
        className="relative"
      >
        {/* Page Header */}
        {page.title && (
          <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '3rem 1rem 2rem 1rem' }} className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">{page.title}</h1>
          </div>
        )}
        
        {/* Page Banner - Conditionally rendered */}
        {page.bannerConfig?.enableBanner === true && page.bannerConfig?.bannerImage && (
          <AnimatedHomepageSection
            enableAnimation={page.bannerConfig?.enableBannerAnimation ?? false}
            animateOnLoad={true}
            animationType="slide-left"
            className={`${bannerStyles.bannerSection} py-8`}
          >
            <img
              src={getImageUrl(page.bannerConfig.bannerImage, 1200, 400)}
              alt="Page Banner"
              width={1200}
              height={400}
              className={bannerStyles.bannerImage}
              style={{
                transform: `translate(${page.bannerConfig.bannerPosition?.offsetX ?? 0}%, ${page.bannerConfig.bannerPosition?.offsetY ?? 0}%) scale(${(page.bannerConfig.bannerPosition?.scale ?? 100) / 100})`,
                transformOrigin: 'center center',
              }}
            />
          </AnimatedHomepageSection>
        )}
      </div>

      {/* Page Sections - Each with its own background */}
      {page.sections && page.sections.length > 0 && (
        <>
          {page.sections.map((section, index) => (
            <section 
              key={section._key || index}
              className="relative"
              style={{
                ...generateSectionBackgroundStyle(section.background, designSystem),
                boxShadow: section.shadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : undefined,
                width: '100%',
                minHeight: 'fit-content',
              }}
            >
              {/* SVG Overlay for this section */}
              <SvgOverlay 
                overlayTexture={section.overlayTexture} 
                backgroundConfig={section.background}
                isSection={true}
              />
              
              <div 
                className="relative z-10"
                style={{
                  width: '100%',
                  maxWidth: '1400px',
                  margin: '0 auto',
                  padding: `${section.padding?.top || '4rem'} 1rem ${section.padding?.bottom || '4rem'} 1rem`,
                  textAlign: section.contentAlignment || 'left',
                }}
              >
                {section.title && (
                  <h2 className="text-3xl font-bold text-white mb-6">
                    {section.title}
                  </h2>
                )}
                {section.content && section.content.length > 0 && (
                  <CustomBlocks blocks={section.content} designSystem={designSystem} />
                )}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
