import React, { useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import PixelButton from "./PixelButton";
import DialogBox from "./DialogBox";
import { Handshake, Users, MessageSquare, ChartBar, Layers, Tool } from "lucide-react";
import { toast } from "sonner";

const ScenarioScreen = () => {
  const { state, dispatch } = useGame();
  const { currentScenario, character, completedScenarios } = state;

  useEffect(() => {
    if (currentScenario) {
      const isFirstTime = !completedScenarios.includes(currentScenario.id);
      if (!isFirstTime) {
        toast.info("You've completed this scenario before. Replay to practice!");
      }
    }
  }, [currentScenario, completedScenarios]);

  if (!currentScenario || !character) return null;

  const handleMakeChoice = (choiceId: string) => {
    const choice = currentScenario.choices.find(c => c.id === choiceId);
    if (choice) {
      // Check if this scenario has a tool reward
      if (currentScenario.toolReward && !character.tools.find(t => t.id === currentScenario.toolReward)) {
        // Add tool to character
        const tool = character.tools.find(t => t.id === currentScenario.toolReward);
        if (tool && !tool.unlocked && character.level >= tool.levelRequired) {
          dispatch({ 
            type: 'UNLOCK_TOOL', 
            payload: { toolId: currentScenario.toolReward }
          });
          toast.success(`🔧 New tool unlocked: ${tool.name}!`);
        }
      }

      dispatch({ type: 'MAKE_CHOICE', payload: choice });
      console.log(`Completed scenario: ${currentScenario.id}`);
      console.log(`Updated completed scenarios:`, [...completedScenarios, currentScenario.id]);
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

  // Get an icon based on the scenario level or type
  const getScenarioIcon = () => {
    const level = currentScenario.level;
    
    if (level === 1) {
      return <MessageSquare className="h-6 w-6 text-game-blue-dark" />;
    } else if (level === 2) {
      // Different icons for different Level 2 scenario types
      if (currentScenario.id.includes('stakeholder')) {
        return <Users className="h-6 w-6 text-game-purple-dark" />;
      } else if (currentScenario.id.includes('agile')) {
        return <Layers className="h-6 w-6 text-game-purple-dark" />;
      } else if (currentScenario.id.includes('vendor')) {
        return <Handshake className="h-6 w-6 text-game-purple-dark" />;
      } else {
        return <ChartBar className="h-6 w-6 text-game-purple-dark" />;
      }
    }
    
    return null;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center mb-4">
        <h1 className="game-title">{currentScenario.title}</h1>
        <div className="ml-3">{getScenarioIcon()}</div>
      </div>
      
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
            
            {currentScenario.toolReward && (
              <div className="mt-3 flex items-center gap-2 px-2 py-1 bg-game-green-dark bg-opacity-10 border border-game-green-dark rounded-sm">
                <Tool className="h-4 w-4 text-game-green-dark" />
                <p className="text-xs font-retro text-game-green-dark">
                  Complete this scenario to unlock a new tool!
                </p>
              </div>
            )}
            
            {currentScenario.level >= 2 && (
              <div className="mt-3 px-2 py-1 bg-game-purple-dark bg-opacity-10 border border-game-purple-dark rounded-sm">
                <p className="text-xs font-retro text-game-purple-dark">
                  Senior BA Challenge • Requires advanced skills
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogBox>

      <div className="space-y-4 w-full max-w-2xl mb-6">
        {currentScenario.choices.map(choice => {
          const canChoose = canMakeChoice(choice);
          
          return (
            <div key={choice.id} className={`pixel-container ${
              currentScenario.level >= 2 ? 'border-l-4 border-l-game-purple-dark' : ''
            }`}>
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
                  color={currentScenario.level >= 2 ? "purple" : "blue"}
                  onClick={() => handleMakeChoice(choice.id)}
                  disabled={!canChoose}
                  className="text-xs"
                >
                  Choose
                </PixelButton>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="w-full max-w-2xl mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {character.tools.filter(tool => tool.unlocked).map(tool => (
            <div 
              key={tool.id} 
              className="pixel-container p-3 flex flex-col items-center gap-2 border-l-4 border-l-game-green-dark"
            >
              <Tool className="h-5 w-5 text-game-green-dark" />
              <div className="text-center">
                <div className="font-retro text-xs mb-1">{tool.name}</div>
                <div className="text-xs text-gray-600">{tool.description}</div>
              </div>
            </div>
          ))}
        </div>
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
