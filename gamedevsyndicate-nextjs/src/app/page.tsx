import RichTextRenderer from '../components/RichTextRendererClient';
import CustomBlocks from '../components/CustomBlocks';
import DynamicStyles from '../components/DynamicStyles';
import SvgOverlay from '../components/SvgOverlay';
import { AnimatedHomepageSection } from '../components/AnimatedHomepageSection';
import { getHomepage, getSiteConfig, getDesignSystem } from '../lib/sanity-queries';
import { getImageUrl } from '../lib/sanity-image';
import { generateSectionBackgroundStyle } from '../lib/background-utils';
import styles from './homepage.module.css';
import type { Metadata } from 'next';
import type { PortableTextBlock } from '@portabletext/types';

// Revalidate this page every 5 minutes in production
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage();
  
  return {
    title: homepage?.metaTitle || 'GameDev Syndicate',
    description: homepage?.metaDescription || 'Your ultimate destination for game development resources, tutorials, and community.',
  };
}

export default async function Home() {
  const homepage = await getHomepage();
  const siteConfig = await getSiteConfig();
  const designSystem = await getDesignSystem();
  
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

  // If no homepage content exists, show default content
  if (!homepage) {
    return (
      <div className={styles.homepage}>
        <DynamicStyles menuColor={menuColor} />
        
        <div className="container mx-auto py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-bold text-white mb-6">
              Welcome to GameDev Syndicate
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Create a &quot;Homepage&quot; document in Sanity Studio to customize this content.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.homepage}>
      <DynamicStyles menuColor={menuColor} />
      
      {/* Global SVG Overlay for homepage */}
      <SvgOverlay 
        overlayTexture={siteConfig?.overlayTexture} 
        backgroundConfig={siteConfig?.pageBackground}
        isSection={false} 
      />
      
      {/* Banner Image */}
      {homepage.bannerImage && (
        <AnimatedHomepageSection
          enableAnimation={homepage.enableBannerAnimation}
          animateOnLoad={true}
          animationType="slide-left"
          className={styles.bannerSection}
        >
          <img
            src={getImageUrl(homepage.bannerImage, 1200, 400)}
            alt="Homepage Banner"
            width={1200}
            height={400}
            className={styles.bannerImage}
            style={{
              transform: `translate(${homepage.bannerPosition?.offsetX || 0}%, ${homepage.bannerPosition?.offsetY || 0}%) scale(${(homepage.bannerPosition?.scale || 100) / 100})`,
              transformOrigin: 'center center',
            }}
          />
        </AnimatedHomepageSection>
      )}

      {/* Text Area */}
      {homepage.textArea && (
        <AnimatedHomepageSection
          enableAnimation={homepage.enableTextAreaAnimation}
          animationType="slide-right"
          className={styles.textSection}
        >
          <div className={styles.textContent}>
            <RichTextRenderer value={homepage.textArea as PortableTextBlock[]} />
          </div>
        </AnimatedHomepageSection>
      )}

      {/* Homepage Sections */}
      {homepage.sections && homepage.sections.length > 0 && (
        <>
          {homepage.sections.map((section, index) => (
            <section 
              key={section._key || index}
              className={`${styles.homepageSection} relative`}
              style={{
                ...generateSectionBackgroundStyle(section.background, designSystem),
              }}
            >
              {/* SVG Overlay for this section */}
              <SvgOverlay 
                overlayTexture={section.overlayTexture} 
                backgroundConfig={section.background}
                isSection={true}
              />
              
              <div 
                className={`${styles.sectionContent} relative z-10`}
                style={{
                  paddingTop: section.padding?.top || '4rem',
                  paddingBottom: section.padding?.bottom || '4rem',
                }}
              >
                {section.title && (
                  <h2 className="text-4xl font-bold text-white mb-8 text-center">
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
