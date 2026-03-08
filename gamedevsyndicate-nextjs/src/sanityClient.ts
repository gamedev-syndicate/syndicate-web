import { createClient } from '@sanity/client';
import { sanityClientConfig } from './lib/sanity-client-config';

export const sanityClient = createClient({
  projectId: sanityClientConfig.projectId,
  dataset: sanityClientConfig.dataset,
  apiVersion: sanityClientConfig.apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});

// Updated client for draft mode
export function getClient(preview = false) {
  return createClient({
    projectId: sanityClientConfig.projectId,
    dataset: sanityClientConfig.dataset,
    apiVersion: sanityClientConfig.apiVersion,
    // Use CDN only on production Vercel deploys — not on preview or local.
    // NODE_ENV is always 'production' on Vercel, so we use VERCEL_ENV instead.
    useCdn: !preview && process.env.VERCEL_ENV === 'production',
    token: process.env.SANITY_API_TOKEN,
    perspective: preview ? 'previewDrafts' : 'published',
  });
}
