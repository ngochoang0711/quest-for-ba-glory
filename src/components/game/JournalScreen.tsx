
import React, { useState } from 'react';
import { useGame } from "@/contexts/GameContext";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Filter, Star, FileText } from "lucide-react";
import PixelButton from "./PixelButton";
import DialogBox from "./DialogBox";

// Sample data - in a real app this would come from context/API
const sampleCategories = [
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
  }
];

const JournalScreen = () => {
  const { state, dispatch } = useGame();
  const { character } = state;
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<'all' | 'drafts' | 'published'>('all');

  if (!character) return null;

  const handleBack = () => {
    dispatch({ type: 'RETURN_TO_MAP' });
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      <h1 className="game-title mb-6">BA Knowledge Journal</h1>

      <DialogBox className="mb-8">
        <p className="font-retro text-sm text-game-pixel-black">
          Welcome to your BA Knowledge Journal! Here you can explore, create, and share insights from your business analysis journey.
        </p>
      </DialogBox>

      {/* Breadcrumb Navigation */}
      <div className="w-full mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Journal</BreadcrumbLink>
            </BreadcrumbItem>
            {activeCategory && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">
                    {sampleCategories.find(c => c.id === activeCategory)?.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Search and Filter Bar */}
      <div className="w-full flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search journal entries..."
            className="w-full pl-10 pr-4 py-2 border-2 border-game-pixel-black rounded font-retro text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <PixelButton
          color="blue"
          onClick={() => {}}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </PixelButton>
      </div>

      {/* Main Content */}
      <div className="w-full">
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
                        <span>12 Entries</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Star className="w-4 h-4 text-game-green-dark" />
                        <span>50 XP Available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="contribute">
            {character.level >= 3 ? (
              <div className="pixel-container p-6">
                <h3 className="font-retro text-lg mb-4">Share Your Knowledge</h3>
                <p className="text-sm mb-4">
                  As a senior BA, you can contribute your insights to help other analysts grow.
                </p>
                <PixelButton
                  color="purple"
                  onClick={() => {}}
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Create New Entry</span>
                </PixelButton>
              </div>
            ) : (
              <div className="pixel-container p-6">
                <p className="text-sm">Reach Level 3 to unlock contribution features!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
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
