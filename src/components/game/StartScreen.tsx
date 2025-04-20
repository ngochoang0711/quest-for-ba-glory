
import React from "react";
import PixelButton from "./PixelButton";
import { useGame } from "@/contexts/GameContext";

const StartScreen = () => {
  const { dispatch } = useGame();

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="game-title mb-6">BA CAREER QUEST</h1>
      <p className="font-retro text-sm max-w-md mb-8 text-game-pixel-black">
        Embark on an epic journey through the world of Business Analysis, 
        from junior analyst to strategic leader!
      </p>
      
      <div className="mb-8 relative">
        <div className="text-7xl mb-4 float">👨‍💼</div>
        <div className="absolute top-1/2 left-full ml-4 text-2xl">+</div>
        <div className="absolute top-1/2 left-full ml-12 text-4xl">💼</div>
        <div className="absolute top-1/2 left-full ml-24 text-2xl">=</div>
        <div className="absolute top-1/2 left-full ml-32 text-4xl">🏆</div>
      </div>
      
      <PixelButton 
        color="purple" 
        onClick={() => dispatch({ type: 'START_GAME' })}
        className="text-lg"
      >
        START QUEST
      </PixelButton>
      
      <div className="mt-12 font-retro text-xs text-gray-600">
        Press START to begin your BA journey
      </div>
    </div>
  );
};

export default StartScreen;
