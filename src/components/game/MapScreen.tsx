
import React from "react";
import { useGame } from "@/contexts/GameContext";
import PixelButton from "./PixelButton";
import DialogBox from "./DialogBox";
import PixelProgressBar from "./PixelProgressBar";

const MapScreen = () => {
  const { state, scenarios, dispatch } = useGame();
  const { character, completedScenarios } = state;

  if (!character) return null;

  // Filter scenarios by character level (only show scenarios that match character level)
  const availableScenarios = scenarios.filter(
    scenario => scenario.level <= character.level
  );

  const handleStartScenario = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      dispatch({ type: 'START_SCENARIO', payload: scenario });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="game-title mb-6">Career Map</h1>

      <div className="flex items-center justify-center mb-6">
        <div className="text-4xl mr-4">{character.sprite}</div>
        <div className="w-48">
          <div className="font-retro text-lg mb-1">{character.name}</div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="level-badge">Level {character.level}</div>
            {character.skillPoints > 0 && (
              <div className="bg-game-green-light text-white text-xs font-retro px-2 py-1 rounded border-2 border-game-pixel-black animate-pulse">
                {character.skillPoints} SP
              </div>
            )}
          </div>
          <div className="text-xs font-retro mb-1">Experience:</div>
          <PixelProgressBar 
            value={character.experience % 100} 
            maxValue={100} 
            color="purple" 
          />
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        <PixelButton
          color="green"
          onClick={() => dispatch({ type: 'OPEN_SKILL_TREE' })}
          className="text-sm"
        >
          Skill Tree {character.skillPoints > 0 ? `(${character.skillPoints})` : ''}
        </PixelButton>
      </div>

      <DialogBox className="mb-8 max-w-lg">
        <p className="font-retro text-sm text-game-pixel-black">
          Choose your next challenge from the career map:
        </p>
      </DialogBox>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-8">
        {availableScenarios.map(scenario => {
          const isCompleted = completedScenarios.includes(scenario.id);
          
          return (
            <div key={scenario.id} className="pixel-container">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-retro text-sm">{scenario.title}</h3>
                {isCompleted && (
                  <span className="bg-game-green-light text-white text-xs font-retro px-2 py-1 rounded">
                    Completed
                  </span>
                )}
              </div>
              
              <p className="text-sm mb-4">{scenario.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="level-badge">Level {scenario.level}</span>
                <PixelButton
                  color={isCompleted ? "green" : "blue"}
                  onClick={() => handleStartScenario(scenario.id)}
                  className="text-xs"
                >
                  {isCompleted ? "Replay" : "Start"}
                </PixelButton>
              </div>
            </div>
          );
        })}
      </div>

      <PixelButton
        color="purple"
        onClick={() => dispatch({ type: 'RESET_GAME' })}
        className="text-sm"
      >
        Return to Title
      </PixelButton>
    </div>
  );
};

export default MapScreen;
