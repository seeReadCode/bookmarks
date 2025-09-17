
import { RSSFeed } from '../types/rss';
import { parseRSSFeed } from '../lib/rssParser';

interface BlogPageProps {
  feed: RSSFeed;
  lastUpdated: string;
}

export default async function Page() {
  let myBlog: BlogPageProps;
  const RSS_FEED_URL = 'https://bg.raindrop.io/rss/public/58719856';
  try {
    // Replace with your RSS feed URL
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
    <div className="max-w-2xl mx-auto px-4 py-8 bg-white dark:bg-gray-900">
      <header className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">bookmarks</h1>
        <a className="text-base text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline" href={RSS_FEED_URL}>rss</a>
      </header>
      <p className="text-gray-600 dark:text-gray-300 mb-2 text-lg">{myBlog.feed.description}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">as of {myBlog.lastUpdated}</p>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {myBlog.feed.items.map((item, index) => (
          <article key={item.guid || index} className="py-6 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  {item.title}
                </a>
              </h2>
              {item.categories && item.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 ml-2">
                  {item.categories.map(category => (
                    !["article", "link", "book", "document"].includes(category.toLowerCase()) &&
                    <span
                      key={category}
                      className="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-200"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div
              className="text-gray-700 dark:text-gray-300 text-sm hide-br hide-img"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-4 mt-1">
              {item.pubDate && <span>added {new Date(item.pubDate).toLocaleDateString()}</span>}
              {item.author && <span>by {item.author}</span>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}