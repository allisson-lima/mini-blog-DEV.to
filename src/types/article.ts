export type ArticleUser = {
  name: string;
  username: string;
  twitter_username: string | null;
  github_username: string | null;
  website_url: string | null;
  profile_image: string;
  profile_image_90: string;
};

export type ArticleOrganization = {
  name: string;
  username: string;
  slug: string;
  profile_image: string;
  profile_image_90: string;
};

export type Article = {
  type_of: 'article';
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  readable_publish_date: string;
  social_image: string;
  tag_list: string[];
  body_markdown: string;
  tags: string;
  slug: string;
  path: string;
  url: string;
  canonical_url: string;
  comments_count: number;
  positive_reactions_count: number;
  public_reactions_count: number;
  collection_id: number | null;
  created_at: string;
  edited_at: string | null;
  crossposted_at: string | null;
  published_at: string;
  last_comment_at: string;
  published_timestamp: string;
  reading_time_minutes: number;
  user: ArticleUser;
  organization: ArticleOrganization | null;
  body_html: string;
};

export type ArticlesQueryParams = {
  page?: number;
  per_page?: number;
  tag?: string;
  tags?: string;
  tags_exclude?: string;
  username?: string;
  state?: 'fresh' | 'rising' | 'all';
  top?: number;
  collection_id?: number;
};

export type CreateArticlePayload = {
  article: {
    title: string;
    body_markdown: string;
    published?: boolean;
    tags: string[];
    series?: string;
    main_image?: string;
    canonical_url?: string;
    description?: string;
    organization_id?: number;
  };
};

export interface Comment {
  id: string;
  body_html: string;
  body_markdown: string;
  created_at: string;
  user: {
    name: string;
    username: string;
    profile_image: string;
  };
  children?: Comment[];
}

export interface Draft {
  id: string;
  title: string;
  body_markdown: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}
