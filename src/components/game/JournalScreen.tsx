
import React, { useState, useEffect, useMemo } from 'react';
import { useGame } from "@/contexts/GameContext";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Search, Filter, Star, FileText, BookOpen, ChevronDown, Plus, Database, Layers, Users, PieChart } from "lucide-react";
import { JournalEntry, JournalCategory, JournalFilter } from "@/types/journal";
import PixelButton from "./PixelButton";
import DialogBox from "./DialogBox";
import KnowledgeArticleCard from "./journal/KnowledgeArticleCard";
import KnowledgeArticleView from "./journal/KnowledgeArticleView";
import KnowledgeArticleForm from "./journal/KnowledgeArticleForm";
import { Checkbox } from "@/components/ui/checkbox";

// Sample data - in a real app this would come from context/API
const sampleCategories: JournalCategory[] = [
  {
    id: "stk",
    name: "Stakeholder Management",
    description: "Techniques for stakeholder analysis and engagement",
    icon: "👥",
    subcategories: [
      { id: "stk-1", name: "Stakeholder Analysis", description: "Methods to identify and analyze stakeholders" },
      { id: "stk-2", name: "Communication Plans", description: "Creating effective communication strategies" },
    ]
  },
  {
    id: "agile",
    name: "Agile Practices",
    description: "Agile methodologies and ceremonies",
    icon: "🔄",
    subcategories: [
      { id: "agile-1", name: "User Stories", description: "Writing effective user stories" },
      { id: "agile-2", name: "Backlog Management", description: "Prioritization and refinement techniques" },
    ]
  },
  {
    id: "data",
    name: "Data Analysis",
    description: "Techniques for analyzing and modeling data",
    icon: "📊",
    subcategories: [
      { id: "data-1", name: "Data Modeling", description: "Entity relationship diagrams and data models" },
      { id: "data-2", name: "Data Visualization", description: "Creating effective data visualizations" }
    ]
  },
  {
    id: "req",
    name: "Requirements Engineering",
    description: "Techniques for eliciting and managing requirements",
    icon: "📝",
    subcategories: [
      { id: "req-1", name: "Elicitation Techniques", description: "Methods for gathering requirements" },
      { id: "req-2", name: "Requirements Documentation", description: "Creating effective requirements documents" }
    ]
  }
];

// Sample articles
const sampleArticles: JournalEntry[] = [
  {
    id: "article-1",
    title: "Effective Stakeholder Mapping Techniques",
    content: "Stakeholder mapping is a critical skill for business analysts. This article covers power/interest grids, influence matrices, and stakeholder onion diagrams.\n\nStart by identifying all potential stakeholders who may be affected by or have influence over your project. Then assess each stakeholder's level of interest, influence, and attitude toward the project.\n\nThe power/interest grid helps you categorize stakeholders based on their level of authority and their level of interest in the project. This helps determine the engagement strategy for each group.",
    category: "stk",
    subcategory: "stk-1",
    status: "published",
    createdAt: new Date(2024, 2, 15),
    updatedAt: new Date(2024, 3, 1),
    tags: ["stakeholders", "analysis", "communication"],
    xpReward: 25,
    authorType: "mentor",
    authorName: "Professor Jane",
    authorSprite: "👩‍🏫",
    readTimeMinutes: 8,
    relatedSkills: ["Stakeholder Analysis", "Communication"],
    references: ["BABOK Guide v3", "Stakeholder Management by John Smith"],
    difficulty: "intermediate"
  },
  {
    id: "article-2",
    title: "Writing User Stories That Deliver Value",
    content: "User stories are short, simple descriptions of a feature told from the perspective of the person who desires the capability. This article explains the 'As a [role], I want [feature], so that [benefit]' format and provides tips for writing effective user stories that focus on delivering business value.",
    category: "agile",
    subcategory: "agile-1",
    status: "published",
    createdAt: new Date(2024, 1, 10),
    updatedAt: new Date(2024, 1, 10),
    tags: ["agile", "user stories", "requirements"],
    xpReward: 15,
    authorType: "mentor",
    authorName: "Agile Coach Mark",
    authorSprite: "👨‍💻",
    readTimeMinutes: 5,
    relatedSkills: ["Agile Methodologies", "Requirements Analysis"],
    references: ["User Story Mapping by Jeff Patton"],
    difficulty: "beginner"
  },
  {
    id: "article-3",
    title: "My Journey with Entity Relationship Diagrams",
    content: "In this personal reflection, I share my experience learning to create effective ERDs and how they've helped me communicate complex data structures to development teams. I cover common pitfalls and lessons learned over 5+ years of data modeling.",
    category: "data",
    subcategory: "data-1",
    status: "draft",
    createdAt: new Date(2024, 3, 5),
    updatedAt: new Date(2024, 3, 5),
    tags: ["data modeling", "ERD", "personal experience"],
    authorType: "player",
    authorName: "Player One",
    readTimeMinutes: 7,
    relatedSkills: ["Data Modeling", "Technical Communication"],
    difficulty: "advanced"
  },
  {
    id: "article-4",
    title: "Workshop Facilitation for Requirements Gathering",
    content: "This comprehensive guide covers planning and running effective workshops to gather requirements from diverse stakeholder groups. Learn techniques for managing difficult participants and ensuring all voices are heard.",
    category: "req",
    subcategory: "req-1",
    status: "published",
    createdAt: new Date(2024, 2, 20),
    updatedAt: new Date(2024, 2, 22),
    tags: ["workshops", "elicitation", "facilitation"],
    xpReward: 30,
    authorType: "mentor",
    authorName: "Workshop Guru Laura",
    authorSprite: "👩‍🎓",
    readTimeMinutes: 12,
    relatedSkills: ["Facilitation", "Requirements Elicitation"],
    references: ["The Workshop Book by Emma Waddell"],
    difficulty: "intermediate",
    completionStatus: "completed"
  }
];

const JournalScreen = () => {
  const { state, dispatch } = useGame();
  const { character } = state;
  
  // UI states
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'article' | 'form'>('list');
  const [selectedArticle, setSelectedArticle] = useState<JournalEntry | null>(null);
  const [editingArticle, setEditingArticle] = useState<Partial<JournalEntry> | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState<JournalFilter>({
    status: undefined,
    authorType: undefined,
    tags: []
  });
  
  // Reset subcategory when category changes
  useEffect(() => {
    setActiveSubcategory(null);
  }, [activeCategory]);
  
  if (!character) return null;
  
  // Filter articles based on current filters
  const filteredArticles = useMemo(() => {
    return sampleArticles.filter(article => {
      // Category filter
      if (activeCategory && article.category !== activeCategory) {
        return false;
      }
      
      // Subcategory filter
      if (activeSubcategory && article.subcategory !== activeSubcategory) {
        return false;
      }
      
      // Status filter
      if (filters.status && article.status !== filters.status) {
        return false;
      }
      
      // Author type filter
      if (filters.authorType && article.authorType !== filters.authorType) {
        return false;
      }
      
      // Tags filter - article must have at least one of the selected tags
      if (filters.tags && filters.tags.length > 0) {
        if (!article.tags.some(tag => filters.tags?.includes(tag))) {
          return false;
        }
      }
      
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  }, [activeCategory, activeSubcategory, filters, searchQuery]);
  
  const handleBack = () => {
    dispatch({ type: 'RETURN_TO_MAP' });
  };
  
  const handleViewArticle = (article: JournalEntry) => {
    setSelectedArticle(article);
    setCurrentView('article');
  };
  
  const handleCreateArticle = () => {
    setEditingArticle({
      status: 'draft',
      authorType: 'player',
      authorName: character.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: []
    });
    setCurrentView('form');
  };
  
  const handleEditArticle = (article: JournalEntry) => {
    setEditingArticle(article);
    setCurrentView('form');
  };
  
  const handleArticleSubmit = (article: Partial<JournalEntry>) => {
    console.log("Article submitted:", article);
    // In a real app, we would save the article to the database
    // For now, we'll just return to the list view
    setCurrentView('list');
    setEditingArticle(null);
  };
  
  const handleMarkAsRead = () => {
    if (selectedArticle) {
      console.log(`Marked article ${selectedArticle.id} as read`);
      // In a real app, we would update the article's completion status
      // and award XP to the player
      
      // For now, we'll just log and return to the list
      setCurrentView('list');
      setSelectedArticle(null);
    }
  };
  
  const currentCategory = activeCategory ? sampleCategories.find(c => c.id === activeCategory) : null;
  const currentSubcategory = activeSubcategory && currentCategory?.subcategories
    ? currentCategory.subcategories.find(s => s.id === activeSubcategory)
    : null;
  
  const renderBreadcrumbs = () => (
    <div className="w-full mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink 
              href="#" 
              onClick={() => {
                setActiveCategory(null);
                setActiveSubcategory(null);
              }}
            >
              Knowledge Base
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {activeCategory && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href="#"
                  onClick={() => {
                    setActiveSubcategory(null);
                  }}
                >
                  {currentCategory?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          
          {activeSubcategory && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">
                  {currentSubcategory?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
  
  const renderSearchAndFilter = () => (
    <div className="w-full flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search knowledge base..."
          className="w-full pl-10 pr-4 py-2 border-2 border-game-pixel-black rounded font-retro text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <PixelButton
        color="blue"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="flex items-center gap-2"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
      </PixelButton>
    </div>
  );
  
  const renderFilters = () => (
    <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <CollapsibleContent>
        <div className="pixel-container p-4 mb-6">
          <h3 className="font-retro text-sm mb-4">Filter Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status filters */}
            <div>
              <h4 className="font-retro text-xs mb-2">Status</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox 
                    checked={filters.status === 'published'}
                    onCheckedChange={() => setFilters({
                      ...filters,
                      status: filters.status === 'published' ? undefined : 'published'
                    })}
                  />
                  <span>Published</span>
                </label>
                
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox 
                    checked={filters.status === 'draft'}
                    onCheckedChange={() => setFilters({
                      ...filters,
                      status: filters.status === 'draft' ? undefined : 'draft'
                    })}
                  />
                  <span>Drafts</span>
                </label>
              </div>
            </div>
            
            {/* Author type filters */}
            <div>
              <h4 className="font-retro text-xs mb-2">Author</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox 
                    checked={filters.authorType === 'mentor'}
                    onCheckedChange={() => setFilters({
                      ...filters,
                      authorType: filters.authorType === 'mentor' ? undefined : 'mentor'
                    })}
                  />
                  <span>Mentor Articles</span>
                </label>
                
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox 
                    checked={filters.authorType === 'player'}
                    onCheckedChange={() => setFilters({
                      ...filters,
                      authorType: filters.authorType === 'player' ? undefined : 'player'
                    })}
                  />
                  <span>Community Articles</span>
                </label>
              </div>
            </div>
            
            {/* Clear filters */}
            <div className="flex items-end">
              <PixelButton
                color="purple"
                onClick={() => {
                  setFilters({});
                  setSearchQuery('');
                }}
                className="text-sm"
              >
                Clear Filters
              </PixelButton>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
  
  const renderTabs = () => (
    <Tabs defaultValue="browse" className="w-full">
      <TabsList className="w-full flex mb-6 bg-transparent">
        <TabsTrigger
          value="browse"
          className="flex-1 data-[state=active]:bg-game-blue-dark data-[state=active]:text-white"
        >
          Browse
        </TabsTrigger>
        {character.level >= 3 && (
          <TabsTrigger
            value="contribute"
            className="flex-1 data-[state=active]:bg-game-purple-dark data-[state=active]:text-white"
          >
            Contribute
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="browse" className="space-y-4">
        {currentView === 'list' && !activeCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleCategories.map((category) => (
              <div
                key={category.id}
                className="pixel-container p-4 hover:translate-y-[-2px] transition-transform cursor-pointer"
                onClick={() => setActiveCategory(category.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-retro text-lg mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                    
                    {/* Entry Status Indicators */}
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-xs">
                        <FileText className="w-4 h-4 text-game-blue-dark" />
                        <span>
                          {sampleArticles.filter(a => a.category === category.id).length} Entries
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Star className="w-4 h-4 text-game-green-dark" />
                        <span>
                          {sampleArticles
                            .filter(a => a.category === category.id && typeof a.xpReward === 'number')
                            .reduce((sum, a) => sum + (a.xpReward || 0), 0)} XP Available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {currentView === 'list' && activeCategory && (
          <>
            {!activeSubcategory && currentCategory?.subcategories && currentCategory.subcategories.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {currentCategory.subcategories.map((subcat) => (
                  <div
                    key={subcat.id}
                    className="pixel-container p-4 hover:translate-y-[-2px] transition-transform cursor-pointer"
                    onClick={() => setActiveSubcategory(subcat.id)}
                  >
                    <h3 className="font-retro text-lg mb-2">{subcat.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{subcat.description}</p>
                    
                    {/* Entry Status Indicators */}
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-xs">
                        <FileText className="w-4 h-4 text-game-blue-dark" />
                        <span>
                          {sampleArticles.filter(a => a.subcategory === subcat.id).length} Entries
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Star className="w-4 h-4 text-game-green-dark" />
                        <span>
                          {sampleArticles
                            .filter(a => a.subcategory === subcat.id && typeof a.xpReward === 'number')
                            .reduce((sum, a) => sum + (a.xpReward || 0), 0)} XP Available
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Display articles for the selected category/subcategory */}
            <div className="space-y-4">
              {filteredArticles.length > 0 ? (
                filteredArticles.map(article => (
                  <KnowledgeArticleCard
                    key={article.id}
                    article={article}
                    onClick={() => handleViewArticle(article)}
                  />
                ))
              ) : (
                <div className="pixel-container p-6 text-center">
                  <p className="font-retro text-sm">No articles found matching your criteria.</p>
                </div>
              )}
            </div>
          </>
        )}
        
        {currentView === 'article' && selectedArticle && (
          <KnowledgeArticleView 
            article={selectedArticle} 
            onBack={() => {
              setCurrentView('list');
              setSelectedArticle(null);
            }}
            onMarkAsRead={handleMarkAsRead}
          />
        )}
      </TabsContent>

      <TabsContent value="contribute">
        {currentView === 'form' && (
          <KnowledgeArticleForm 
            article={editingArticle || undefined}
            categories={sampleCategories}
            onSubmit={handleArticleSubmit}
            onCancel={() => {
              setCurrentView('list');
              setEditingArticle(null);
            }}
          />
        )}
        
        {currentView === 'list' && (
          <div className="pixel-container p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-retro text-lg">My Contributions</h3>
              <PixelButton
                color="purple"
                onClick={handleCreateArticle}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create New</span>
              </PixelButton>
            </div>
            
            <div className="space-y-4">
              {filteredArticles
                .filter(a => a.authorType === 'player')
                .map(article => (
                  <div
                    key={article.id}
                    className="flex justify-between items-center p-3 border-b border-dashed border-gray-300 hover:bg-gray-50"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        {article.status === 'draft' && (
                          <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">Draft</span>
                        )}
                        <h4 className="font-retro text-sm">{article.title}</h4>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Last updated: {article.updatedAt.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <PixelButton
                        color="blue"
                        onClick={() => handleViewArticle(article)}
                        className="text-xs py-1 px-2"
                      >
                        View
                      </PixelButton>
                      <PixelButton
                        color="purple"
                        onClick={() => handleEditArticle(article)}
                        className="text-xs py-1 px-2"
                      >
                        Edit
                      </PixelButton>
                    </div>
                  </div>
                ))}
                
              {filteredArticles.filter(a => a.authorType === 'player').length === 0 && (
                <div className="text-center p-4">
                  <p className="font-retro text-sm">You haven't created any articles yet.</p>
                  <p className="text-xs mt-2">Share your knowledge with the BA community!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
  
  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      <h1 className="game-title mb-6">BA Knowledge Journal</h1>

      <DialogBox className="mb-8">
        <p className="font-retro text-sm text-game-pixel-black">
          Welcome to your BA Knowledge Journal! Here you can explore, create, and share insights from your business analysis journey.
        </p>
      </DialogBox>

      {/* Main Content */}
      <div className="w-full">
        {currentView !== 'form' && renderBreadcrumbs()}
        {currentView === 'list' && renderSearchAndFilter()}
        {currentView === 'list' && renderFilters()}
        {renderTabs()}
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <PixelButton color="purple" onClick={handleBack}>
          Return to Map
        </PixelButton>
      </div>
    </div>
  );
};

export default JournalScreen;
