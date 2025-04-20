import React, { useState, useEffect } from "react";
import { GameProvider } from "@/contexts/GameContext";
import Game from "@/components/game/Game";
import LoadingScreen from "@/components/game/LoadingScreen";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time to ensure fonts and assets are loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Add click/keypress listener to skip loading screen
    const handleInteraction = () => {
      setIsLoading(false);
      clearTimeout(timer);
    };

    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('click', handleInteraction);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <GameProvider>
          <div className="min-h-screen flex flex-col bg-game-pixel-black">
            <main className="flex-1 flex flex-col">
              <Game />
            </main>
            
            <footer className="p-3 text-center">
              <p className="font-retro text-xs text-gray-400">
                © 2025 BA Career Quest - 8-Bit Edition
              </p>
            </footer>
          </div>
        </GameProvider>
      )}
    </div>
  );
};

export default Index;
