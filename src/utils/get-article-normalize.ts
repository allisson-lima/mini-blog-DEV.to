import { Article } from "@/types/article";

export function normalizeTags(
  tagList: string | string[] | undefined
): string[] {
  if (!tagList) return [];

  if (typeof tagList === "string") {
    return tagList
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  if (Array.isArray(tagList)) {
    return tagList.filter(Boolean);
  }

  return [];
}

export function getArticleTags(article: Article): string[] {
  return normalizeTags(article.tag_list || article.tags || []);
}
