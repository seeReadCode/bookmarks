
// lib/rssParser.ts
import { parseString } from 'xml2js';
import { RSSFeed, RSSItem } from '../types/rss';

export async function parseRSSFeed(url: string): Promise<RSSFeed> {
  try {
    // Fetch the RSS feed
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlData = await response.text();

    // Parse XML to JSON
    return new Promise((resolve, reject) => {
      parseString(xmlData, { explicitArray: false }, (err, result) => {
        if (err) {
          reject(new Error(`XML parsing error: ${err.message}`));
          return;
        }

        try {
          const channel = result.rss?.channel;
          if (!channel) {
            throw new Error('Invalid RSS format: missing channel');
          }

          // Handle both single item and array of items
          const rawItems = Array.isArray(channel.item) ? channel.item : [channel.item].filter(Boolean);

          // eslint-disable-next-line
          const items: RSSItem[] = rawItems.map((item: any) => ({
            title: item.title || '',
            description: item.description || '',
            link: item.link || '',
            pubDate: item.pubDate || '',
            guid: item.guid?._?.toString() || item.guid?.toString(),
            author: item.author || item['dc:creator'],
            categories: Array.isArray(item.category)
              ? item.category
              : item.category
                ? [item.category]
                : undefined,
          }));

          const feed: RSSFeed = {
            title: channel.title || '',
            description: channel.description || '',
            link: channel.link || '',
            items,
          };

          resolve(feed);
        } catch (parseErr) {
          reject(new Error(`RSS structure parsing error: ${parseErr}`));
        }
      });
    });
  } catch (error) {
    throw new Error(`Failed to fetch RSS feed: ${error}`);
  }
}

// package.json dependencies needed:
/*
{
  "dependencies": {
    "xml2js": "^0.4.23",
    "@types/xml2js": "^0.4.11"
  }
}
*/

// utils/rssCache.ts - Optional caching utility
interface CacheEntry {
  data: RSSFeed;
  timestamp: number;
  ttl: number;
}

class RSSCache {
  private cache = new Map<string, CacheEntry>();

  async get(url: string, ttlMinutes: number = 30): Promise<RSSFeed | null> {
    const entry = this.cache.get(url);

    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl || Date.now() - entry.timestamp > (ttlMinutes * 60 * 1000);
    if (isExpired) {
      this.cache.delete(url);
      return null;
    }

    return entry.data;
  }

  set(url: string, data: RSSFeed, ttlMinutes: number = 30): void {
    this.cache.set(url, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const rssCache = new RSSCache();

// Enhanced parser with caching
export async function parseRSSFeedWithCache(url: string, ttlMinutes: number = 30): Promise<RSSFeed> {
  // Check cache first
  const cached = await rssCache.get(url, ttlMinutes);
  if (cached) {
    return cached;
  }

  // Parse fresh data
  const feed = await parseRSSFeed(url);

  // Cache the result
  rssCache.set(url, feed, ttlMinutes);

  return feed;
}