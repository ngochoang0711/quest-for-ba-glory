
import React from "react";
import { useGame } from "@/contexts/GameContext";
import PixelButton from "./PixelButton";
import DialogBox from "./DialogBox";
import PixelProgressBar from "./PixelProgressBar";

const SkillTreeScreen = () => {
  const { state, dispatch } = useGame();
  const { character, skillCategories } = state;

  if (!character) return null;

  const handleAllocatePoint = (skillId: string) => {
    if (character.skillPoints > 0) {
      dispatch({ type: 'ALLOCATE_SKILL_POINT', payload: { skillId } });
    }
  };

  // Get a skill by ID from the character's skills array
  const getSkill = (skillId: string) => {
    return character.skills.find(s => s.id === skillId);
  };

  // Check if a skill can be upgraded
  const canUpgradeSkill = (skillId: string) => {
    const skill = getSkill(skillId);
    return skill && skill.level < skill.maxLevel && character.skillPoints > 0;
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="game-title mb-6">Skill Tree</h1>
      
      <div className="flex items-center justify-center mb-6">
        <div className="text-4xl mr-4">{character.sprite}</div>
        <div className="w-48">
          <div className="font-retro text-lg mb-1">{character.name}</div>
          <div className="level-badge mb-2">Level {character.level}</div>
          <div className="font-retro text-sm mb-2">
            Skill Points: <span className="text-game-green-dark font-bold">{character.skillPoints}</span>
          </div>
        </div>
      </div>

      {character.skillPoints > 0 && (
        <DialogBox className="mb-6 max-w-lg">
          <p className="font-retro text-sm text-game-pixel-black">
            You have {character.skillPoints} skill points to allocate. Click on a skill to upgrade it.
          </p>
        </DialogBox>
      )}

      <div className="w-full max-w-4xl mb-8">
        {skillCategories.map(category => (
          <div key={category.id} className="mb-8">
            <h2 className="font-retro text-lg text-game-blue-dark mb-4">{category.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.skills.map(skillId => {
                const skill = getSkill(skillId);
                if (!skill) return null;
                
                const canUpgrade = canUpgradeSkill(skillId);
                
                return (
                  <div key={skill.id} className={`pixel-container ${canUpgrade ? 'border-game-green-light' : ''}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-retro text-sm">{skill.name}</h3>
                      <span className={`font-retro text-xs ${skill.level > 0 ? 'text-game-blue-dark' : 'text-gray-500'}`}>
                        Level {skill.level}/{skill.maxLevel}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-4">{skill.description}</p>
                    
                    <div className="flex flex-col space-y-3">
                      <PixelProgressBar 
                        value={skill.level} 
                        maxValue={skill.maxLevel} 
                        color={skill.level > 0 ? "blue" : "purple"} 
                      />
                      
                      {canUpgrade ? (
                        <PixelButton
                          color="green"
                          onClick={() => handleAllocatePoint(skill.id)}
                          className="text-xs self-end"
                        >
                          Upgrade (+1)
                        </PixelButton>
                      ) : skill.level < skill.maxLevel ? (
                        <div className="text-xs text-gray-500 text-right font-retro mt-2">
                          {character.skillPoints === 0 ? "Need more skill points" : "Max level reached"}
                        </div>
                      ) : (
                        <div className="text-xs text-game-green-dark text-right font-retro mt-2">Mastered!</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <PixelButton
        color="purple"
        onClick={() => dispatch({ type: 'RETURN_TO_MAP' })}
        className="text-sm"
      >
        Return to Map
      </PixelButton>
    </div>
  );
};

export default SkillTreeScreen;
