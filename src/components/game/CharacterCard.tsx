
import React from "react";
import { BACharacter } from "@/types/game";
import { cn } from "@/lib/utils";
import PixelProgressBar from "./PixelProgressBar";

type CharacterCardProps = {
  character: BACharacter;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

const CharacterCard = ({ 
  character, 
  selected = false, 
  onClick,
  className
}: CharacterCardProps) => {
  return (
    <div 
      className={cn(
        "pixel-container cursor-pointer transition-all duration-200",
        selected ? "bg-game-blue-light" : "bg-white hover:bg-gray-50",
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center p-4">
        <div className="text-5xl mb-3">{character.sprite}</div>
        <h3 className="font-retro text-sm md:text-base mb-2">{character.name}</h3>
        
        <div className="w-full mt-2">
          <h4 className="font-retro text-xs text-gray-700 mb-1">Skills:</h4>
          <div className="space-y-2">
            {character.skills.slice(0, 3).map(skill => (
              <div key={skill.id} className="w-full">
                <PixelProgressBar
                  label={skill.name}
                  value={skill.level}
                  maxValue={skill.maxLevel}
                  color="purple"
                  className="mb-1"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
