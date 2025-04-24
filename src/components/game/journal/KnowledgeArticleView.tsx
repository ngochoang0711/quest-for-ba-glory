
import React from 'react';
import { JournalEntry } from "@/types/journal";
import { Bookmark, Clock, Medal, ArrowLeft, Tag, User } from "lucide-react";
import PixelButton from "../PixelButton";
import DialogBox from "../DialogBox";

interface KnowledgeArticleViewProps {
  article: JournalEntry;
  onBack: () => void;
  onMarkAsRead?: () => void;
}

const KnowledgeArticleView = ({ article, onBack, onMarkAsRead }: KnowledgeArticleViewProps) => {
  const formattedDate = article.updatedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center mb-4">
        <PixelButton color="blue" onClick={onBack} className="mr-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </PixelButton>
        
        {article.status === 'draft' && (
          <span className="bg-yellow-500 text-white px-2 py-1 text-xs font-retro rounded">DRAFT</span>
        )}
      </div>
      
      <h2 className="font-retro text-2xl text-game-blue-dark">{article.title}</h2>
      
      <div className="flex flex-wrap gap-2 items-center text-xs mb-4">
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          <span>{article.readTimeMinutes || 5} min read</span>
        </div>
        
        <div className="flex items-center">
          <User className="w-3 h-3 mr-1" />
          <span>By {article.authorName}</span>
        </div>
        
        <div className="flex items-center">
          <Bookmark className="w-3 h-3 mr-1" />
          <span>Last updated: {formattedDate}</span>
        </div>
        
        {article.xpReward && (
          <div className="flex items-center text-game-green-dark">
            <Medal className="w-3 h-3 mr-1" />
            <span>{article.xpReward} XP</span>
          </div>
        )}
      </div>
      
      <DialogBox className="mb-4">
        <div className="font-retro text-sm mb-2">Difficulty: {article.difficulty || 'Intermediate'}</div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {article.tags.map(tag => (
            <span 
              key={tag} 
              className="bg-game-purple-light bg-opacity-20 px-2 py-0.5 text-xs font-retro rounded text-game-purple-dark flex items-center"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </DialogBox>
      
      <div className="pixel-container p-4">
        <div className="prose font-retro text-sm whitespace-pre-wrap">
          {article.content}
        </div>
        
        {article.relatedSkills && article.relatedSkills.length > 0 && (
          <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-300">
            <h4 className="font-retro text-sm mb-2">Related Skills:</h4>
            <div className="flex flex-wrap gap-1">
              {article.relatedSkills.map(skill => (
                <span 
                  key={skill} 
                  className="bg-game-blue-light bg-opacity-20 px-2 py-0.5 text-xs font-retro rounded text-game-blue-dark"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {article.references && article.references.length > 0 && (
          <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-300">
            <h4 className="font-retro text-sm mb-2">References:</h4>
            <ul className="list-disc pl-5 text-xs font-retro">
              {article.references.map((ref, index) => (
                <li key={index} className="mb-1">{ref}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {onMarkAsRead && article.status === 'published' && (
        <div className="flex justify-end mt-4">
          <PixelButton 
            color="green" 
            onClick={onMarkAsRead}
            className="flex items-center"
          >
            <Medal className="w-4 h-4 mr-2" />
            {article.completionStatus === 'completed' 
              ? 'Already Completed' 
              : `Mark as Read (+ ${article.xpReward || 5} XP)`}
          </PixelButton>
        </div>
      )}
    </div>
  );
};

export default KnowledgeArticleView;
