'use client'

import { resolveColor } from '../../lib/colorUtils';
import type { DesignSystem } from '../../types/designSystem';
import { 
  FaTwitter, FaLinkedin, FaFacebook, FaInstagram, FaYoutube, 
  FaGithub, FaDiscord, FaTwitch, FaTiktok, FaReddit, 
  FaMedium, FaMastodon, FaGlobe, FaEnvelope 
} from 'react-icons/fa';
import { SiBluesky, SiThreads } from 'react-icons/si';

interface SocialMediaLink {
  platform: string;
  url: string;
  label?: string;
}

interface SocialMediaBlockType {
  _type: 'socialMediaBlock';
  _key: string;
  internalLabel?: string;
  title?: string;
  links: SocialMediaLink[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  showLabels?: boolean;
  iconSize?: 'medium' | 'large';
  linkColorSelection?: string;
  customLinkColor?: { hex: string };
}

interface SocialMediaBlockProps {
  value: SocialMediaBlockType;
  designSystem?: DesignSystem | null;
}

export function SocialMediaBlock({ value, designSystem }: SocialMediaBlockProps) {
  
  const {
    title,
    links = [],
    layout = 'horizontal',
    showLabels = false,
    iconSize = 'medium',
    linkColorSelection,
    customLinkColor,
  } = value;

  // Resolve link color
  const linkColor = resolveColor(
    { 
      colorSelection: linkColorSelection as 'primary' | 'secondary' | 'tertiary' | 'buttonPrimary' | 'buttonSecondary' | 'custom' | undefined, 
      customColor: customLinkColor as { hex: string; alpha?: number; rgb: { r: number; g: number; b: number; a: number } } | undefined
    },
    designSystem ?? null,
    '#9ca3af' // Default gray-400
  );

  const getSocialIcon = (platform: string, size: 'medium' | 'large') => {
    const iconSize = size === 'large' ? 28 : 24;
    const iconProps = { size: iconSize };
    switch (platform) {
      case 'twitter': return <FaTwitter {...iconProps} />;
      case 'linkedin': return <FaLinkedin {...iconProps} />;
      case 'facebook': return <FaFacebook {...iconProps} />;
      case 'instagram': return <FaInstagram {...iconProps} />;
      case 'youtube': return <FaYoutube {...iconProps} />;
      case 'github': return <FaGithub {...iconProps} />;
      case 'discord': return <FaDiscord {...iconProps} />;
      case 'twitch': return <FaTwitch {...iconProps} />;
      case 'tiktok': return <FaTiktok {...iconProps} />;
      case 'reddit': return <FaReddit {...iconProps} />;
      case 'medium': return <FaMedium {...iconProps} />;
      case 'mastodon': return <FaMastodon {...iconProps} />;
      case 'bluesky': return <SiBluesky {...iconProps} />;
      case 'threads': return <SiThreads {...iconProps} />;
      case 'website': return <FaGlobe {...iconProps} />;
      case 'email': return <FaEnvelope {...iconProps} />;
      default: return <FaGlobe {...iconProps} />;
    }
  };

  const getPlatformLabel = (platform: string) => {
    const labels: Record<string, string> = {
      twitter: 'Twitter / X',
      linkedin: 'LinkedIn',
      facebook: 'Facebook',
      instagram: 'Instagram',
      youtube: 'YouTube',
      github: 'GitHub',
      discord: 'Discord',
      twitch: 'Twitch',
      tiktok: 'TikTok',
      reddit: 'Reddit',
      medium: 'Medium',
      mastodon: 'Mastodon',
      bluesky: 'Bluesky',
      threads: 'Threads',
      website: 'Website',
      email: 'Email',
    };
    return labels[platform] || platform;
  };

  // Container classes based on layout
  const containerClasses = {
    horizontal: 'flex flex-wrap items-center justify-center gap-4',
    vertical: 'flex flex-col items-start gap-3',
    grid: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4',
  };

  if (!links || links.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {title && (
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {title}
          </h2>
        )}
        
        <div className={containerClasses[layout]}>
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 border border-gray-700/50 bg-gray-800/40 hover:bg-gray-700/60 hover:border-gray-600"
              title={link.label || getPlatformLabel(link.platform)}
            >
              <span 
                className="transition-colors duration-300"
                style={{ color: linkColor }}
              >
                {getSocialIcon(link.platform, iconSize)}
              </span>
              {(showLabels && link.label) && (
                <span className="text-gray-300 group-hover:text-white transition-colors duration-300 font-medium text-sm">
                  {link.label}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
