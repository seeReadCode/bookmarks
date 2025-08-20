// types/rss.ts
export interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid?: string;
  author?: string;
  categories?: string[];
}

export interface RSSFeed {
  title: string;
  description: string;
  link: string;
  items: RSSItem[];
}
