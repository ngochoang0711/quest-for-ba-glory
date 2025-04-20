
import React from "react";
import { useGame } from "@/contexts/GameContext";
import PixelButton from "./PixelButton";
import DialogBox from "./DialogBox";
import PixelProgressBar from "./PixelProgressBar";

const ResultScreen = () => {
  const { state, dispatch } = useGame();
  const { character, choiceResult } = state;

  if (!character || !choiceResult) return null;

  return (
    <div className="flex flex-col items-center">
      <h1 className="game-title mb-6">Result</h1>
      
      <div className="flex items-center justify-center mb-6">
        <div className="text-4xl mr-4">{character.sprite}</div>
        <div>
          <div className="font-retro text-sm mb-1">{character.name}</div>
          <div className="level-badge">Level {character.level}</div>
        </div>
      </div>

      <DialogBox className="mb-6 max-w-2xl">
        <p className="font-retro text-sm text-game-pixel-black mb-4">
          {choiceResult.text}
        </p>
        
        <div className="bg-game-blue-light bg-opacity-20 p-4 rounded-sm">
          <div className="font-retro text-sm mb-2 text-game-blue-dark">Results:</div>
          
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">⭐</span>
            <span className="font-retro text-sm">
              Gained {choiceResult.experience} XP
            </span>
          </div>
          
          {choiceResult.skillsIncreased.length > 0 && (
            <div className="space-y-1">
              {choiceResult.skillsIncreased.map(skillInc => (
                <div key={skillInc.skillId} className="flex items-center">
                  <span className="text-xl mr-2">📈</span>
                  <span className="font-retro text-sm">
                    {skillInc.name} +{skillInc.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogBox>
      
      <div className="space-y-4 w-full max-w-2xl mb-6">
        <h3 className="font-retro text-lg text-center">Updated Skills</h3>
        
        <div className="pixel-container p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {character.skills.map(skill => (
              <div key={skill.id} className="w-full">
                <PixelProgressBar
                  label={skill.name}
                  value={skill.level}
                  maxValue={skill.maxLevel}
                  color={
                    choiceResult.skillsIncreased.some(inc => inc.skillId === skill.id)
                      ? "green"
                      : "purple"
                  }
                  className="mb-1"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <PixelButton
        color="green"
        onClick={() => dispatch({ type: 'CONTINUE_TO_MAP' })}
      >
        Continue Journey
      </PixelButton>
    </div>
  );
};

export default ResultScreen;
