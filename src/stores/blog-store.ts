import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Article, Draft, Comment } from "@/types/article";

interface BlogState {
  articles: Article[];
  currentArticle: Article | null;
  articlesLoading: boolean;
  drafts: Draft[];
  currentDraft: Draft | null;
  comments: Record<string, Comment[]>;
  selectedTags: string[];
  searchQuery: string;
  currentPage: number;
  setArticles: (articles: Article[]) => void;
  setCurrentArticle: (article: Article | null) => void;
  setArticlesLoading: (loading: boolean) => void;
  addDraft: (draft: Omit<Draft, "id" | "created_at" | "updated_at">) => void;
  updateDraft: (id: string, draft: Partial<Draft>) => void;
  deleteDraft: (id: string) => void;
  setCurrentDraft: (draft: Draft | null) => void;
  setComments: (articleId: string, comments: Comment[]) => void;
  addComment: (articleId: string, comment: Comment) => void;
  setSelectedTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  clearFilters: () => void;
}

export const useBlogStore = create<BlogState>()(
  persist(
    (set, get) => ({
      articles: [],
      currentArticle: null,
      articlesLoading: false,
      drafts: [],
      currentDraft: null,
      comments: {},
      selectedTags: [],
      searchQuery: "",
      currentPage: 1,
      setArticles: (articles) => set({ articles }),
      setCurrentArticle: (article) => set({ currentArticle: article }),
      setArticlesLoading: (loading) => set({ articlesLoading: loading }),
      addDraft: (draftData) => {
        const draft: Draft = {
          ...draftData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set((state) => ({ drafts: [...state.drafts, draft] }));
      },

      updateDraft: (id, updates) => {
        set((state) => ({
          drafts: state.drafts.map((draft) =>
            draft.id === id
              ? { ...draft, ...updates, updated_at: new Date().toISOString() }
              : draft
          ),
        }));
      },

      deleteDraft: (id) => {
        set((state) => ({
          drafts: state.drafts.filter((draft) => draft.id !== id),
          currentDraft:
            state.currentDraft?.id === id ? null : state.currentDraft,
        }));
      },
      setCurrentDraft: (draft) => set({ currentDraft: draft }),
      setComments: (articleId, comments) => {
        set((state) => ({
          comments: { ...state.comments, [articleId]: comments },
        }));
      },

      addComment: (articleId, comment) => {
        set((state) => ({
          comments: {
            ...state.comments,
            [articleId]: [...(state.comments[articleId] || []), comment],
          },
        }));
      },
      setSelectedTags: (tags) => set({ selectedTags: tags }),
      toggleTag: (tag) => {
        const { selectedTags } = get();
        const newTags = selectedTags.includes(tag)
          ? selectedTags.filter((t) => t !== tag)
          : [...selectedTags, tag];
        set({ selectedTags: newTags });
      },
      setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
      setCurrentPage: (page) => set({ currentPage: page }),
      clearFilters: () =>
        set({ selectedTags: [], searchQuery: "", currentPage: 1 }),
    }),
    {
      name: "blog-storage",
      partialize: (state) => ({
        drafts: state.drafts,
        selectedTags: state.selectedTags,
      }),
    }
  )
);
