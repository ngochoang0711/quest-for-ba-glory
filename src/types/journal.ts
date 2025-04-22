
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
