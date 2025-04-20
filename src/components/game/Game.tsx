
import React from "react";
import { useGame } from "@/contexts/GameContext";
import StartScreen from "./StartScreen";
import CharacterSelectionScreen from "./CharacterSelectionScreen";
import MapScreen from "./MapScreen";
import ScenarioScreen from "./ScenarioScreen";
import ResultScreen from "./ResultScreen";

const Game = () => {
  const { state } = useGame();
  
  return (
    <div className="w-full py-6 px-4 md:px-6 pixelated-bg min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="pixel-container bg-white p-6 md:p-8">
          {state.stage === 'start' && <StartScreen />}
          {state.stage === 'character' && <CharacterSelectionScreen />}
          {state.stage === 'map' && <MapScreen />}
          {state.stage === 'scenario' && <ScenarioScreen />}
          {state.stage === 'result' && <ResultScreen />}
        </div>
      </div>
    </div>
  );
};

export default Game;
