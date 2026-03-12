'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import DynamicNavigation from './DynamicNavigation'
import DynamicStyles from './DynamicStyles'
import VisualEditingWrapper from './VisualEditingWrapper'
import type { NavigationItem } from '../types/sanity'

interface ConditionalLayoutProps {
  children: ReactNode
  navigationItems: NavigationItem[]
  menuColor: string
  navigationTextColor: string
  navigationActiveColor: string
  dataset: string
  appEnvironment: 'dev' | 'production' | 'preview'
}

export default function ConditionalLayout({
  children,
  navigationItems,
  menuColor,
  navigationTextColor,
  navigationActiveColor,
  dataset,
  appEnvironment,
}: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isStudioRoute = pathname?.startsWith('/studio')

  const showDatasetBanner = dataset && dataset !== 'production'
  const bannerBackground = dataset === 'dev'
    ? 'var(--color-secondary, #f59e0b)'
    : 'var(--color-tertiary, #0ea5e9)'
  const bannerTextColor = dataset === 'dev'
    ? 'var(--color-button-primary, #111827)'
    : 'var(--color-button-secondary, #0b1727)'
  const bannerSummary = `${appEnvironment.toUpperCase()} / ${dataset}`

  // For studio routes, render children without any site layout
  if (isStudioRoute) {
    return <>{children}</>
  }

  // For regular routes, render with full site layout
  return (
    <>
      {showDatasetBanner && (
        <div
          className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
          style={{ backgroundColor: bannerBackground, color: bannerTextColor, borderColor: 'var(--color-button-primary, rgba(0, 0, 0, 0.12))', opacity: 0.6 }}
        >
          <div className="mx-auto max-w-6xl flex items-center justify-center text-sm font-semibold border-b px-4 py-2 backdrop-blur-md">
            Environment: {bannerSummary}
          </div>
        </div>
      )}
      <header className="w-full py-4 flex items-center justify-center bg-black/60 backdrop-blur-md shadow-lg fixed top-0 left-0 z-40" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
        <DynamicNavigation items={navigationItems} />
      </header>
      <DynamicStyles menuColor={menuColor} navigationTextColor={navigationTextColor} navigationActiveColor={navigationActiveColor} />
      <VisualEditingWrapper />
      <main className="pt-20 px-4 content-container min-h-screen relative z-10">
        {children}
      </main>
    </>
  )
}
