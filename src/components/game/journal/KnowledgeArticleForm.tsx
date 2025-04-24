import React, { useState } from 'react';
import { JournalEntry, JournalCategory } from "@/types/journal";
import { X, Plus, Save, BookOpen, Archive } from "lucide-react";
import PixelButton from "../PixelButton";
import DialogBox from "../DialogBox";

interface KnowledgeArticleFormProps {
  article?: Partial<JournalEntry>;
  categories: JournalCategory[];
  onSubmit: (article: Partial<JournalEntry>) => void;
  onCancel: () => void;
}

const KnowledgeArticleForm = ({ 
  article, 
  categories, 
  onSubmit, 
  onCancel 
}: KnowledgeArticleFormProps) => {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [category, setCategory] = useState(article?.category || '');
  const [subcategory, setSubcategory] = useState(article?.subcategory || '');
  const [tags, setTags] = useState<string[]>(article?.tags || []);
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(article?.status || 'draft');
  const [tagInput, setTagInput] = useState('');
  const [readTimeMinutes, setReadTimeMinutes] = useState(article?.readTimeMinutes || 5);
  const [xpReward, setXpReward] = useState(article?.xpReward || 10);

  const selectedCategory = categories.find(c => c.id === category);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...article,
      title,
      content,
      category,
      subcategory: subcategory || undefined,
      tags,
      status,
      readTimeMinutes,
      xpReward
    });
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="w-full">
      <h2 className="font-pixel text-xl mb-4 text-game-purple-dark">
        {article?.id ? 'Edit Knowledge Article' : 'Create New Knowledge Article'}
      </h2>
      
      <DialogBox className="mb-6">
        <p className="font-pixel text-sm">
          Share your BA knowledge with the community! Articles can be saved as drafts until you're ready to publish.
        </p>
      </DialogBox>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-retro text-sm mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border-2 border-game-pixel-black font-pixel-sans text-sm"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-retro text-sm mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory(''); // Reset subcategory when category changes
              }}
              className="w-full p-2 border-2 border-game-pixel-black font-pixel-sans text-sm"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block font-retro text-sm mb-1">Subcategory</label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full p-2 border-2 border-game-pixel-black font-pixel-sans text-sm"
              disabled={!selectedCategory?.subcategories?.length}
            >
              <option value="">Select Subcategory</option>
              {selectedCategory?.subcategories?.map(subcat => (
                <option key={subcat.id} value={subcat.id}>{subcat.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block font-retro text-sm mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border-2 border-game-pixel-black font-pixel-sans text-sm min-h-[200px]"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-retro text-sm mb-1">Read Time (minutes)</label>
            <input
              type="number"
              min="1"
              value={readTimeMinutes}
              onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
              className="w-full p-2 border-2 border-game-pixel-black font-pixel-sans text-sm"
            />
          </div>
          
          <div>
            <label className="block font-retro text-sm mb-1">XP Reward</label>
            <input
              type="number"
              min="0"
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value))}
              className="w-full p-2 border-2 border-game-pixel-black font-pixel-sans text-sm"
            />
          </div>
        </div>
        
        <div>
          <label className="block font-retro text-sm mb-1">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <div key={tag} className="bg-game-purple-light bg-opacity-20 px-2 py-1 rounded flex items-center">
                <span className="text-xs font-pixel-sans mr-2">{tag}</span>
                <button 
                  type="button" 
                  onClick={() => removeTag(tag)}
                  className="text-game-purple-dark hover:text-game-pixel-black"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add a tag"
              className="flex-1 p-2 border-2 border-game-pixel-black font-pixel-sans text-sm"
            />
            <button 
              type="button" 
              onClick={addTag}
              className="bg-game-purple-dark text-white px-3 border-2 border-game-pixel-black ml-2"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div>
          <label className="block font-retro text-sm mb-1">Status</label>
          <div className="flex space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                checked={status === 'draft'}
                onChange={() => setStatus('draft')}
                className="mr-2"
              />
              <span className="font-pixel-sans text-sm">Draft</span>
            </label>
            
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                checked={status === 'published'}
                onChange={() => setStatus('published')}
                className="mr-2"
              />
              <span className="font-pixel-sans text-sm">Publish</span>
            </label>
            
            {article?.id && (
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={status === 'archived'}
                  onChange={() => setStatus('archived')}
                  className="mr-2"
                />
                <span className="font-pixel-sans text-sm">Archive</span>
              </label>
            )}
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <PixelButton 
            onClick={onCancel}
            color="blue" 
            className="flex items-center"
          >
            <X className="w-4 h-4 mr-2" /> 
            Cancel
          </PixelButton>
          
          <div className="space-x-2">
            <PixelButton 
              type="submit" 
              color={status === 'published' ? "green" : "purple"}
              className="flex items-center"
            >
              {status === 'published' ? (
                <>
                  <BookOpen className="w-4 h-4 mr-2" /> 
                  Publish
                </>
              ) : status === 'archived' ? (
                <>
                  <Archive className="w-4 h-4 mr-2" /> 
                  Archive
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> 
                  Save Draft
                </>
              )}
            </PixelButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default KnowledgeArticleForm;
