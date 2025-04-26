
import React from 'react';
import { Wrench } from 'lucide-react';
import { BATool } from '@/types/game';

interface ToolsPanelProps {
  tools: BATool[];
  characterLevel: number;
}

const ToolsPanel = ({ tools, characterLevel }: ToolsPanelProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tools.map(tool => {
        const isLocked = !tool.unlocked && characterLevel < tool.levelRequired;
        
        return (
          <div 
            key={tool.id}
            className={`pixel-container p-4 ${
              tool.unlocked 
                ? 'border-l-4 border-l-game-green-dark' 
                : 'border-l-4 border-l-gray-300 opacity-75'
            }`}
          >
            <div className="flex items-start gap-3">
              <Wrench className={`h-5 w-5 ${
                tool.unlocked ? 'text-game-green-dark' : 'text-gray-400'
              }`} />
              <div>
                <h3 className="font-retro text-sm mb-1">{tool.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{tool.description}</p>
                {isLocked && (
                  <div className="text-xs text-red-500 font-retro">
                    Unlocks at level {tool.levelRequired}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToolsPanel;
