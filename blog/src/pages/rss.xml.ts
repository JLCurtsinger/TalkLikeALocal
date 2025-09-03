import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('posts'))
    .filter(p => !p.data.draft)
    .sort((a,b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime());

  return rss({
    title: 'Talk Like a Local — Blog',
    description: 'Pronunciations, culture, and preservation resources.',
    site: context.site?.href ?? 'https://yourdomain.com',
    items: posts.map((p) => ({
      link: `/blog/${p.slug}/`,
      title: p.data.title,
      description: p.data.description,
      pubDate: new Date(p.data.pubDate),
    })),
    stylesheet: false
  });
}
