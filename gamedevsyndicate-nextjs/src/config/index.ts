/**
 * Application Configuration Module
 * 
 * ⚠️ WARNING: This module uses Node.js `fs` module and is SERVER-ONLY.
 * DO NOT import this in client components - it will cause build errors.
 * 
 * Configuration Priority (highest to lowest):
 * 1. Environment Variables (process.env)
 * 2. Local Config File (c:\devsecrets\syndicate\local.config.json) - Development only
 * 3. Default Config (hardcoded values below)
 * 
 * In Production/Vercel:
 * - Local config file is automatically skipped
 * - Only environment variables and defaults are used
 * - Set all required env vars in Vercel dashboard
 * 
 * For client-safe Sanity config, use: src/lib/sanity-client-config.ts
 */

import fs from 'fs'

interface AppConfig {
  sanity: {
    projectId: string
    dataset: string
    apiVersion: string
    token?: string
    previewSecret: string
    studioUrl: string
  }
  app: {
    url: string
    environment: 'dev' | 'production' | 'preview'
  }
  features: {
    visualEditing: boolean
    caching: boolean
  }
  resend?: {
    apiKey?: string
    fromEmail?: string
  }
}

// Default configuration
const defaultConfig: AppConfig = {
  sanity: {
    projectId: 'iu8qgjyf',
    dataset: 'production',
    apiVersion: '2023-01-01',
    previewSecret: 'change-me-in-production',
    studioUrl: 'http://localhost:3333',
  },
  app: {
    url: 'http://localhost:3000',
    environment: 'dev',
  },
  features: {
    visualEditing: true,
    caching: true,
  },
  resend: {
    apiKey: undefined,
    fromEmail: undefined,
  },
}

/**
 * Load local configuration file from dev secrets location
 * 
 * Only runs in development (NODE_ENV !== 'production')
 * Looks for: c:\devsecrets\syndicate\local.config.json
 * 
 * This allows sensitive config to be stored outside the repo while
 * keeping it accessible across multiple projects on the same machine.
 */
function loadLocalConfig(): Partial<AppConfig> {
  if (process.env.NODE_ENV === 'production') {
    return {}
  }

  try {
    // Try to load local config file from dev secrets location
    const configPath = 'c:\\devsecrets\\syndicate\\local.config.json'
    
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf-8')
      const localConfig = JSON.parse(configContent)
      console.log('📁 Loaded local configuration file from c:\\devsecrets\\syndicate\\local.config.json')
      console.log('🔧 Local config preview secret:', localConfig.sanity?.previewSecret)
      return localConfig
    } else {
      console.log('📁 No local config found at c:\\devsecrets\\syndicate\\local.config.json')
    }
  } catch (error) {
    // File doesn't exist or has syntax errors - that's ok
    console.log('📁 No local config found at c:\\devsecrets\\syndicate\\local.config.json')
    console.error('Config loading error:', error)
    return {}
  }
  
  return {}
}

/**
 * Load configuration from environment variables
 * 
 * Supports both NEXT_PUBLIC_ (client-safe) and server-only variables.
 * See .env.example for full list of supported variables.
 */
function loadEnvConfig(): Partial<AppConfig> {
  const envConfig: Partial<AppConfig> = {}

  // Sanity configuration
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    if (!envConfig.sanity) envConfig.sanity = {} as AppConfig['sanity'];
    envConfig.sanity.projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  }

  if (process.env.NEXT_PUBLIC_SANITY_DATASET) {
    if (!envConfig.sanity) envConfig.sanity = {} as AppConfig['sanity'];
    envConfig.sanity.dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  }

  if (process.env.SANITY_API_TOKEN) {
    if (!envConfig.sanity) envConfig.sanity = {} as AppConfig['sanity'];
    envConfig.sanity.token = process.env.SANITY_API_TOKEN
  }

  if (process.env.SANITY_PREVIEW_SECRET) {
    if (!envConfig.sanity) envConfig.sanity = {} as AppConfig['sanity'];
    envConfig.sanity.previewSecret = process.env.SANITY_PREVIEW_SECRET
  }

  if (process.env.NEXT_PUBLIC_SANITY_STUDIO_URL) {
    if (!envConfig.sanity) envConfig.sanity = {} as AppConfig['sanity'];
    envConfig.sanity.studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL
  }

  // App configuration
  if (process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL) {
    if (!envConfig.app) envConfig.app = {} as AppConfig['app'];
    envConfig.app.url = process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}`
  }

  // VERCEL_ENV is injected automatically by Vercel: 'production' | 'preview' | 'development'
  // We do NOT use NODE_ENV here — Vercel always sets it to 'production' regardless of environment.
  // When running locally without Vercel, VERCEL_ENV is undefined and the default config ('dev') applies.
  const vercelEnv = process.env.VERCEL_ENV
  if (vercelEnv === 'preview') {
    if (!envConfig.app) envConfig.app = {} as AppConfig['app'];
    envConfig.app.environment = 'preview'
  } else if (vercelEnv === 'production') {
    if (!envConfig.app) envConfig.app = {} as AppConfig['app'];
    envConfig.app.environment = 'production'
  } else if (vercelEnv === 'development') {
    if (!envConfig.app) envConfig.app = {} as AppConfig['app'];
    envConfig.app.environment = 'dev'
  }

  // Feature flags
  if (process.env.ENABLE_VISUAL_EDITING !== undefined) {
    if (!envConfig.features) envConfig.features = {} as AppConfig['features'];
    envConfig.features.visualEditing = process.env.ENABLE_VISUAL_EDITING === 'true'
  }

  if (process.env.ENABLE_CACHING !== undefined) {
    if (!envConfig.features) envConfig.features = {} as AppConfig['features'];
    envConfig.features.caching = process.env.ENABLE_CACHING === 'true'
  }

  // Resend email configuration
  if (process.env.RESEND_API_KEY) {
    if (!envConfig.resend) envConfig.resend = {} as AppConfig['resend'];
    envConfig.resend!.apiKey = process.env.RESEND_API_KEY
  }

  if (process.env.RESEND_FROM_EMAIL) {
    if (!envConfig.resend) envConfig.resend = {} as AppConfig['resend'];
    envConfig.resend!.fromEmail = process.env.RESEND_FROM_EMAIL
  }

  // Clean up empty objects
  if (Object.keys(envConfig.sanity || {}).length === 0) delete envConfig.sanity
  if (Object.keys(envConfig.app || {}).length === 0) delete envConfig.app
  if (Object.keys(envConfig.features || {}).length === 0) delete envConfig.features

  return envConfig
}

/**
 * Deep merge utility for combining configuration objects
 */
function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target }
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key], source[key] as Partial<T[Extract<keyof T, string>]>)
    } else if (source[key] !== undefined) {
      result[key] = source[key] as T[Extract<keyof T, string>]
    }
  }
  
  return result
}

/**
 * Create final configuration by merging all sources
 * 
 * Merge order: default → local → environment
 * Later sources override earlier ones
 */
function createConfig(): AppConfig {
  const localConfig = loadLocalConfig()
  const envConfig = loadEnvConfig()
  
  // Merge: default -> local -> environment
  let config = deepMerge(defaultConfig, localConfig)
  config = deepMerge(config, envConfig)
  
  // Log configuration source in development
  if (process.env.NODE_ENV === 'development') {
    console.log('⚙️ Configuration loaded from:', {
      default: '✅',
      local: Object.keys(localConfig).length > 0 ? '✅' : '❌',
      environment: Object.keys(envConfig).length > 0 ? '✅' : '❌',
    })
  }
  
  return config
}

export const config = createConfig()
export type { AppConfig }
