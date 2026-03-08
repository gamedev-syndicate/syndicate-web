import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import ConditionalLayout from '../components/ConditionalLayout';
import { DesignSystemProvider } from '../components/DesignSystemProvider';
import { getSiteConfig, getDesignSystem } from '../lib/sanity-queries';
import { generateBackgroundStyle } from '../lib/background-utils';
import type { NavigationItem } from '../types/sanity';

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GameDev Syndicate",
  description: "Your game development hub",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await getSiteConfig();
  const designSystem = await getDesignSystem();

  console.warn('⚙️ Sanity config (per-request):', {
    vercelEnv: process.env.VERCEL_ENV ?? '(not set — local)',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? '(not set — using default)',
  });
  
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
  
  // Handle navigation text color with design system support
  let navigationTextColor = 'rgb(255, 255, 255)'; // Default white color
  
  if (siteConfig?.navigationTextColorSelection) {
    if (siteConfig.navigationTextColorSelection !== 'custom') {
      // Use design system colors
      if (designSystem?.colors) {
        const colorValue = designSystem.colors[siteConfig.navigationTextColorSelection as keyof typeof designSystem.colors];
        if (colorValue?.hex) {
          navigationTextColor = colorValue.hex;
        }
      }
    } else if (siteConfig.customNavigationTextColor) {
      // Use custom color
      navigationTextColor = siteConfig.customNavigationTextColor.hex;
    }
  }
  
  // Handle navigation active indicator color with design system support
  let navigationActiveColor = 'rgb(147, 197, 253)'; // Default blue color
  
  if (siteConfig?.navigationActiveColorSelection) {
    if (siteConfig.navigationActiveColorSelection !== 'custom') {
      // Use design system colors
      if (designSystem?.colors) {
        const colorValue = designSystem.colors[siteConfig.navigationActiveColorSelection as keyof typeof designSystem.colors];
        if (colorValue?.hex) {
          navigationActiveColor = colorValue.hex;
        }
      }
    } else if (siteConfig.customNavigationActiveColor) {
      // Use custom color
      navigationActiveColor = siteConfig.customNavigationActiveColor.hex;
    }
  }
  
  const navigationItems: NavigationItem[] = siteConfig?.navigationItems || [];
  const backgroundStyle = generateBackgroundStyle(siteConfig?.pageBackground, designSystem);

  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased min-h-screen`}
        style={backgroundStyle}
      >
        <DesignSystemProvider designSystem={designSystem}>
          <ConditionalLayout
            navigationItems={navigationItems}
            menuColor={menuColor}
            navigationTextColor={navigationTextColor}
            navigationActiveColor={navigationActiveColor}
          >
            {children}
          </ConditionalLayout>
        </DesignSystemProvider>
      </body>
    </html>
  );
}
