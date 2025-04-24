
import React from 'react';
import { JournalEntry } from "@/types/journal";
import { Clock, BookOpen, Edit, Archive, Medal } from "lucide-react";

interface KnowledgeArticleCardProps {
  article: JournalEntry;
  onClick: () => void;
}

const KnowledgeArticleCard = ({ article, onClick }: KnowledgeArticleCardProps) => {
  // Format date for display
  const formattedDate = article.updatedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const getStatusIcon = () => {
    switch(article.status) {
      case 'draft':
        return <Edit className="w-4 h-4 text-yellow-500" />;
      case 'published':
        return <BookOpen className="w-4 h-4 text-green-600" />;
      case 'archived':
        return <Archive className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };
  
  const getStatusText = () => {
    switch(article.status) {
      case 'draft': return 'Draft';
      case 'published': return 'Published';
      case 'archived': return 'Archived';
      default: return '';
    }
  };

  // Truncate content for preview
  const previewContent = article.content.length > 120 
    ? article.content.substring(0, 120) + '...' 
    : article.content;
  
  return (
    <div 
      className="pixel-container p-4 hover:translate-y-[-2px] transition-transform cursor-pointer font-pixel"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-pixel text-base text-game-blue-dark">{article.title}</h3>
        <div className="flex items-center space-x-1 text-xs">
          {getStatusIcon()}
          <span className="font-pixel">{getStatusText()}</span>
        </div>
      </div>
      
      <p className="text-sm mb-3 line-clamp-2 font-pixel-sans">{previewContent}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {article.tags.slice(0, 3).map(tag => (
          <span 
            key={tag} 
            className="bg-gray-100 px-2 py-0.5 text-xs font-pixel rounded"
          >
            {tag}
          </span>
        ))}
        {article.tags.length > 3 && (
          <span className="text-xs font-pixel">+{article.tags.length - 3} more</span>
        )}
      </div>
      
      <div className="flex justify-between items-center text-xs font-pixel text-gray-600">
        <div className="flex items-center">
          {article.authorType === 'mentor' ? (
            <span className="flex items-center text-game-purple-dark">
              <span className="mr-1">{article.authorSprite}</span>
              {article.authorName}
            </span>
          ) : (
            <span>By {article.authorName}</span>
          )}
        </div>
        
        <div className="flex space-x-3">
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {article.readTimeMinutes || 5} min
          </span>
          
          {article.xpReward && (
            <span className="flex items-center text-game-green-dark">
              <Medal className="w-3 h-3 mr-1" />
              {article.xpReward} XP
            </span>
          )}
        </div>
      </div>
      
      {article.completionStatus === 'completed' && (
        <div className="absolute top-2 right-2">
          <div className="bg-game-green-dark text-white text-xs font-pixel px-2 py-0.5 rounded-full">
            Completed
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeArticleCard;
