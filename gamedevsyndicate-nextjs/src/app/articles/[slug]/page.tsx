import { notFound } from 'next/navigation';
import { getArticlePage, getAllArticlePages, getDesignSystem } from '../../../lib/sanity-queries';
import { getImageUrl } from '../../../lib/sanity-image';
import type { ArticlePage } from '../../../types/sanity';
import CustomBlocks from '../../../components/CustomBlocks';
import { Metadata } from 'next';

// Revalidate this page every 1 minute in production (articles change frequently)
export const revalidate = 60;

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticlePages();
  return articles.map((article: ArticlePage) => ({
    slug: article.slug.current,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticlePage(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const metaTitle = article.seo?.metaTitle || article.title;
  const metaDescription = article.seo?.metaDescription || article.excerpt || '';
  const keywords = article.seo?.keywords || article.tags || [];

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: article.author ? [article.author] : undefined,
      images: article.featuredImage ? [getImageUrl(article.featuredImage, 1200, 630)] : undefined,
    },
  };
}

export default async function ArticlePageComponent({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticlePage(slug);
  const designSystem = await getDesignSystem();

  if (!article) {
    notFound();
  }

  const featuredImageUrl = article.featuredImage
    ? getImageUrl(article.featuredImage, 1200, 600)
    : null;

  return (
    <article className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            {/* Category & Date */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
              {article.category && (
                <span className="px-3 py-1 bg-gray-800/50 rounded-full capitalize">
                  {article.category}
                </span>
              )}
              {article.publishedAt && (
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
              {article.updatedAt && article.updatedAt !== article.publishedAt && (
                <span className="text-gray-500">
                  (Updated: {new Date(article.updatedAt).toLocaleDateString()})
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white !mb-4 !mt-12">
              {article.title}
            </h1>

            {/* Author */}
            {article.author && (
              <p className="text-gray-300 mb-4">
                By <span className="font-semibold">{article.author}</span>
              </p>
            )}

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-xl text-gray-300 leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured Image */}
          {featuredImageUrl && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={featuredImageUrl}
                alt={article.featuredImage?.alt || article.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="mb-12">
            <CustomBlocks blocks={article.content} designSystem={designSystem} />
          </div>

          {/* Related Articles */}
          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <aside className="mt-16 pt-8 border-t border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {article.relatedArticles.map((related: ArticlePage) => {
                  const relatedImageUrl = related.featuredImage
                    ? getImageUrl(related.featuredImage, 400, 300)
                    : null;

                  return (
                    <a
                      key={related._id}
                      href={`/articles/${related.slug.current}`}
                      className="group block bg-gray-800/30 rounded-lg overflow-hidden hover:bg-gray-800/50 transition-colors"
                    >
                      {relatedImageUrl && (
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={relatedImageUrl}
                            alt={related.featuredImage?.alt || related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        {related.category && (
                          <span className="text-xs text-gray-400 uppercase">
                            {related.category}
                          </span>
                        )}
                        <h3 className="text-lg font-semibold text-white mt-1 group-hover:text-blue-400 transition-colors">
                          {related.title}
                        </h3>
                        {related.excerpt && (
                          <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                            {related.excerpt}
                          </p>
                        )}
                        {related.publishedAt && (
                          <time className="text-xs text-gray-500 mt-2 block">
                            {new Date(related.publishedAt).toLocaleDateString()}
                          </time>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </aside>
          )}
        </div>
    </article>
  );
}
