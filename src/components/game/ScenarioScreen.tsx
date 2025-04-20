
import React from "react";
import { useGame } from "@/contexts/GameContext";
import PixelButton from "./PixelButton";
import DialogBox from "./DialogBox";

const ScenarioScreen = () => {
  const { state, dispatch } = useGame();
  const { currentScenario, character } = state;

  if (!currentScenario || !character) return null;

  const handleMakeChoice = (choiceId: string) => {
    const choice = currentScenario.choices.find(c => c.id === choiceId);
    if (choice) {
      dispatch({ type: 'MAKE_CHOICE', payload: choice });
    }
  };

  // Check if player's skills meet requirements
  const canMakeChoice = (choice: typeof currentScenario.choices[0]) => {
    if (!choice.skillRequirements) return true;
    
    return choice.skillRequirements.every(req => {
      const skill = character.skills.find(s => s.id === req.skillId);
      return skill && skill.level >= req.minLevel;
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="game-title mb-4">{currentScenario.title}</h1>
      
      <div className="flex items-center justify-center mb-6">
        <div className="text-4xl mr-4">{character.sprite}</div>
        <div>
          <div className="font-retro text-sm mb-1">{character.name}</div>
          <div className="level-badge">Level {character.level}</div>
        </div>
      </div>

      <DialogBox className="mb-6 max-w-2xl">
        <div className="flex items-start">
          {currentScenario.npcSprite && (
            <div className="text-4xl mr-4 float">{currentScenario.npcSprite}</div>
          )}
          <div>
            {currentScenario.npcName && (
              <div className="font-retro text-game-blue-dark text-sm mb-2">
                {currentScenario.npcName}:
              </div>
            )}
            <p className="font-retro text-sm text-game-pixel-black">
              {currentScenario.description}
            </p>
          </div>
        </div>
      </DialogBox>

      <div className="space-y-4 w-full max-w-2xl mb-6">
        {currentScenario.choices.map(choice => {
          const canChoose = canMakeChoice(choice);
          
          return (
            <div key={choice.id} className="pixel-container">
              <p className="font-retro text-sm mb-4">{choice.text}</p>
              
              {choice.skillRequirements && choice.skillRequirements.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-retro text-xs mb-2">Requirements:</h4>
                  <div className="space-y-1">
                    {choice.skillRequirements.map(req => {
                      const skill = character.skills.find(s => s.id === req.skillId);
                      const meetsReq = skill && skill.level >= req.minLevel;
                      
                      return (
                        <div 
                          key={req.skillId} 
                          className={`font-retro text-xs ${meetsReq ? 'text-game-green-dark' : 'text-red-500'}`}
                        >
                          {skill?.name} Lvl {req.minLevel}
                          {meetsReq ? ' ✓' : ' ✗'}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <PixelButton
                  color="blue"
                  onClick={() => handleMakeChoice(choice.id)}
                  className={`text-xs ${!canChoose ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Choose
                </PixelButton>
              </div>
            </div>
          );
        })}
      </div>
      
      <PixelButton
        color="purple"
        onClick={() => dispatch({ type: 'CONTINUE_TO_MAP' })}
        className="text-sm"
      >
        Return to Map
      </PixelButton>
    </div>
  );
};

export default ScenarioScreen;
