
export type JournalStatus = 'draft' | 'published' | 'archived';

export type LearningModule = {
  id: string;
  name: string;
  description: string;
  weekNumber: number;
  topics: LearningTopic[];
  completionPercentage?: number;
};

export type LearningTopic = {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
  resources?: string[];
  notes?: string;
};

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
  // Learning curriculum specific fields
  learningModule?: string; // ID of the related learning module
  weekNumber?: number;
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
  weekNumber?: number;
  learningModule?: string;
};

// AI Learning Curriculum specific types
export type AICurriculum = {
  id: string;
  title: string;
  description: string;
  totalWeeks: number;
  modules: LearningModule[];
  overallProgress: number;
};

export const AI_LEARNING_CURRICULUM: AICurriculum = {
  id: "ai-curriculum-2025",
  title: "AI Fundamentals & Applications",
  description: "A comprehensive curriculum covering AI concepts, prompt engineering, and model fine-tuning",
  totalWeeks: 6,
  modules: [
    {
      id: "ai-basics",
      name: "Basic AI Concepts",
      description: "Foundation of AI principles and architectures",
      weekNumber: 1,
      topics: [
        {
          id: "supervised-unsupervised",
          name: "Supervised & Unsupervised Learning",
          description: "Understanding the fundamental learning paradigms in AI",
          isCompleted: false
        },
        {
          id: "reinforcement-learning",
          name: "Reinforcement Learning",
          description: "Learning through interaction with environment and rewards",
          isCompleted: false
        }
      ]
    },
    {
      id: "ai-advanced",
      name: "Advanced AI Concepts",
      description: "Deep learning and neural network architectures",
      weekNumber: 2,
      topics: [
        {
          id: "deep-learning",
          name: "Deep Learning Principles",
          description: "Fundamental concepts of deep neural networks",
          isCompleted: false
        },
        {
          id: "neural-networks",
          name: "Neural Networks & Transformers",
          description: "Architecture and principles behind modern AI models",
          isCompleted: false
        },
        {
          id: "llms",
          name: "Large Language Models",
          description: "Understanding how LLMs work and their capabilities",
          isCompleted: false
        },
        {
          id: "ai-quiz",
          name: "Foundations Quiz",
          description: "Test understanding of AI concepts and architectures",
          isCompleted: false
        }
      ]
    },
    {
      id: "prompt-engineering-1",
      name: "Prompt Engineering Basics",
      description: "Introduction to effective prompting techniques",
      weekNumber: 3,
      topics: [
        {
          id: "gpt4-prompting",
          name: "GPT-4.1 Prompting Guide",
          description: "Learn effective prompting for OpenAI models",
          isCompleted: false
        }
      ]
    },
    {
      id: "prompt-engineering-2",
      name: "Advanced Prompt Engineering",
      description: "Sophisticated prompting strategies and techniques",
      weekNumber: 4,
      topics: [
        {
          id: "anthropic-prompting",
          name: "Anthropic Prompt Libraries",
          description: "Specialized prompting for Claude models",
          isCompleted: false
        },
        {
          id: "chain-of-thought",
          name: "Chain of Thought Prompting",
          description: "Development of step-by-step reasoning in prompts",
          isCompleted: false
        }
      ]
    },
    {
      id: "fine-tuning-1",
      name: "Model Fine-Tuning Basics",
      description: "Introduction to customizing AI models",
      weekNumber: 5,
      topics: [
        {
          id: "fine-tuning-methods",
          name: "Fine-Tuning Methods",
          description: "SFT, DPO, and direct preference optimization",
          isCompleted: false
        },
        {
          id: "datasets",
          name: "Training Datasets",
          description: "Working with training and validation datasets",
          isCompleted: false
        }
      ]
    },
    {
      id: "fine-tuning-2",
      name: "Advanced Model Fine-Tuning",
      description: "Implementation of fine-tuning techniques",
      weekNumber: 6,
      topics: [
        {
          id: "training-pipelines",
          name: "Training Pipelines",
          description: "Implementation with OpenAI and Hugging Face",
          isCompleted: false
        }
      ]
    }
  ],
  overallProgress: 0
};
