
import React from "react";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-game-pixel-black flex flex-col items-center justify-center">
      <div className="font-retro text-white text-xl mb-6">BA CAREER QUEST</div>
      <div className="w-48 h-6 bg-gray-700 border-2 border-white p-1">
        <div className="bg-game-blue-light h-full w-full pixel-progress"></div>
      </div>
      <div className="mt-4 font-retro text-gray-400 text-xs blink">Press Any Key...</div>
    </div>
  );
};

export default LoadingScreen;
