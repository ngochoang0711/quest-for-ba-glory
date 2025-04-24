
export type JournalStatus = 'draft' | 'published' | 'archived';

export type JournalEntry = {
  id: string;
  title: string;
  content: string;
  category: string;
  subcategory?: string;
  status: JournalStatus;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  xpReward?: number;
  authorType: 'player' | 'mentor';
  authorName: string;
  authorSprite?: string;
  // New fields for enhanced knowledge system
  relatedSkills?: string[]; // Links to game skills
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  readTimeMinutes?: number;
  references?: string[];
  lastReadByPlayer?: Date;
  completionStatus?: 'unread' | 'in-progress' | 'completed';
};

export type JournalCategory = {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
};

// New types for knowledge base system
export type JournalArticleView = {
  article: JournalEntry;
  relatedArticles?: JournalEntry[];
  hasBeenRead: boolean;
};

export type JournalFilter = {
  status?: JournalStatus;
  category?: string;
  subcategory?: string;
  authorType?: 'player' | 'mentor';
  tags?: string[];
  searchQuery?: string;
};
