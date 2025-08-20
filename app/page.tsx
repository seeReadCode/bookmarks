
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { RSSFeed } from '../types/rss';
import { parseRSSFeed } from '../lib/rssParser';

interface BlogPageProps {
  feed: RSSFeed;
  lastUpdated: string;
}

export default async function Page() {
  let myBlog: BlogPageProps;
  try {
    // Replace with your RSS feed URL
    const RSS_FEED_URL = 'https://bg.raindrop.io/rss/public/58719856';
    const feed = await parseRSSFeed(RSS_FEED_URL);
    myBlog = {
      feed,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    // Return empty feed on error to prevent build failures
    myBlog = {
      feed: {
        title: 'Blog Feed',
        description: 'Unable to load feed',
        link: '',
        items: [],
      },
      lastUpdated: new Date().toISOString(),
    };
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{myBlog.feed.title}</h1>
      <p className="text-gray-600 mb-8">{myBlog.feed.description}</p>
      <p className="text-sm text-gray-500 mb-8">Last updated: {myBlog.lastUpdated}</p>
      <div className="space-y-6">
        {myBlog.feed.items.map((item, index) => (
          <article key={item.guid || index} className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-2">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                {item.title}
              </a>
            </h2>
            <div
              className="text-gray-700 mb-2"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
            <div className="text-sm text-gray-500">
              {item.pubDate && <span>Published: {new Date(item.pubDate).toLocaleDateString()}</span>}
              {item.author && <span className="ml-4">By: {item.author}</span>}
            </div>
            {item.categories && item.categories.length > 0 && (
              <div className="mt-2">
                {item.categories.map(category => (
                  <span
                    key={category}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}