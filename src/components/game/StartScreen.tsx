
import React, { useState, useEffect } from "react";
import PixelButton from "./PixelButton";
import { useGame } from "@/contexts/GameContext";
import DialogBox from "./DialogBox";
import PixelProgressBar from "./PixelProgressBar";
import { BookOpen, Map, Star, Users, Settings, HelpCircle, ArrowRight } from "lucide-react";

const StartScreen = () => {
  const { state, dispatch } = useGame();
  const { character } = state;
  const [showTutorial, setShowTutorial] = useState(false);
  const [isNewPlayer, setIsNewPlayer] = useState(!character);
  
  // Career levels for roadmap display
  const careerLevels = [
    { level: 0, title: "Rookie Analyst" },
    { level: 1, title: "Junior Business Analyst" },
    { level: 2, title: "Senior Business Analyst" },
    { level: 3, title: "Lead/Consultant BA" },
  ];

  // Get personalized welcome message based on character or default
  const getWelcomeMessage = () => {
    if (character) {
      const careerTitle = careerLevels.find(c => c.level === character.level)?.title || "Analyst";
      return `Welcome back, ${careerTitle}! Ready for your next quest?`;
    }
    return "Welcome to your BA Career Quest! Ready to begin your journey?";
  };

  const handleStartQuest = () => {
    if (character) {
      dispatch({ type: 'CONTINUE_TO_MAP' });
    } else {
      dispatch({ type: 'START_GAME' });
    }
  };

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    // If new player, move them to character creation after seeing tutorial
    if (isNewPlayer) {
      dispatch({ type: 'START_GAME' });
    }
  };

  const renderNewPlayerIntro = () => (
    <div className="mb-8 text-center">
      <div className="text-7xl mb-6 float">👨‍💼</div>
      <div className="flex justify-center items-center space-x-4 mb-6">
        <div className="text-2xl">+</div>
        <div className="text-4xl">💼</div>
        <div className="text-2xl">=</div>
        <div className="text-4xl">🏆</div>
      </div>
      
      <p className="font-retro text-sm max-w-md mx-auto mt-8 text-game-pixel-black">
        Embark on an epic journey through the world of Business Analysis, 
        from junior analyst to strategic leader!
      </p>
      
      <div className="mt-8">
        <PixelButton 
          color="purple" 
          onClick={handleShowTutorial}
          className="flex items-center justify-center mx-auto"
        >
          <HelpCircle className="mr-2 w-4 h-4" />
          <span>How to Play</span>
        </PixelButton>
      </div>
    </div>
  );

  const renderCareerSnapshot = () => (
    <div className="mb-8 w-full max-w-md">
      <p className="font-retro text-lg text-game-purple-dark mb-6 text-center">
        {getWelcomeMessage()}
      </p>
      
      <div className="pixel-container p-4 mb-4">
        <div className="flex items-center mb-4">
          <div className="text-5xl mr-4 float">{character?.sprite}</div>
          <div className="flex-1">
            <div className="font-retro text-lg mb-1">{character?.name}</div>
            <div className="level-badge mb-2">Level {character?.level} - {careerLevels.find(c => c.level === character?.level)?.title}</div>
            
            <div className="text-xs font-retro mb-1">Experience:</div>
            <PixelProgressBar 
              value={character?.experience % 100} 
              maxValue={100} 
              color="purple" 
            />
          </div>
        </div>
        
        {character?.skillPoints > 0 && (
          <div className="bg-game-green-light bg-opacity-20 p-2 rounded-sm border-2 border-dashed border-game-green-dark mb-2">
            <p className="text-xs font-retro text-game-green-dark">
              <Star className="inline-block w-4 h-4 mr-1" /> 
              You have {character.skillPoints} skill points to allocate!
            </p>
          </div>
        )}
        
        {/* Career Roadmap Display */}
        <div className="mt-4">
          <h3 className="font-retro text-xs mb-2">Career Roadmap:</h3>
          <div className="flex w-full h-4 rounded overflow-hidden bg-gray-200 border border-game-pixel-black">
            {careerLevels.map((careerLevel, index) => (
              <div 
                key={index}
                className={`flex-1 h-full ${
                  careerLevel.level < character?.level 
                    ? 'bg-game-green-dark' 
                    : careerLevel.level === character?.level 
                      ? 'bg-game-purple-dark' 
                      : 'bg-gray-300'
                }`}
                title={careerLevel.title}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1 text-[8px] font-retro">
            {careerLevels.map((careerLevel, index) => (
              <div 
                key={index}
                className={
                  careerLevel.level <= character?.level 
                    ? 'text-game-green-dark' 
                    : 'text-gray-500'
                }
              >
                L{careerLevel.level}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Navigation Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <PixelButton 
          color="purple" 
          onClick={handleStartQuest}
          className="flex items-center justify-center"
        >
          <Map className="mr-2 w-4 h-4" />
          <span>Start Quest</span>
        </PixelButton>
        
        <PixelButton 
          color="green" 
          onClick={() => dispatch({ type: 'OPEN_SKILL_TREE' })}
          className={`flex items-center justify-center ${character?.skillPoints > 0 ? 'animate-pulse' : ''}`}
        >
          <Star className="mr-2 w-4 h-4" />
          <span>Skill Tree {character?.skillPoints > 0 ? `(${character.skillPoints})` : ''}</span>
        </PixelButton>
        
        <PixelButton 
          color="blue" 
          onClick={handleShowTutorial}
          className="flex items-center justify-center"
        >
          <HelpCircle className="mr-2 w-4 h-4" />
          <span>How to Play</span>
        </PixelButton>
        
        <PixelButton 
          color="blue" 
          className="flex items-center justify-center opacity-50 cursor-not-allowed"
          disabled={true}
        >
          <Settings className="mr-2 w-4 h-4" />
          <span>Settings</span>
        </PixelButton>
      </div>
    </div>
  );

  const renderTutorial = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="pixel-container bg-white p-6 max-w-lg">
        <h2 className="font-retro text-lg mb-4">How to Play</h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex">
            <div className="text-2xl mr-3">📋</div>
            <div>
              <h3 className="font-retro text-sm text-game-blue-dark">Create Your BA</h3>
              <p className="text-sm">Choose your business analyst and begin your career journey</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="text-2xl mr-3">🗺️</div>
            <div>
              <h3 className="font-retro text-sm text-game-blue-dark">Explore Scenarios</h3>
              <p className="text-sm">Complete business analysis challenges to gain XP and skills</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="text-2xl mr-3">⭐</div>
            <div>
              <h3 className="font-retro text-sm text-game-blue-dark">Improve Your Skills</h3>
              <p className="text-sm">Allocate skill points to advance your capabilities</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="text-2xl mr-3">🏆</div>
            <div>
              <h3 className="font-retro text-sm text-game-blue-dark">Advance Your Career</h3>
              <p className="text-sm">Level up from Rookie to Lead Business Analyst</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <PixelButton 
            color="green" 
            onClick={handleCloseTutorial}
            className="flex items-center justify-center"
          >
            <ArrowRight className="mr-2 w-4 h-4" />
            <span>{isNewPlayer ? "Start Your Journey" : "Got it!"}</span>
          </PixelButton>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="game-title mb-4">BA CAREER QUEST</h1>
      
      {isNewPlayer ? renderNewPlayerIntro() : renderCareerSnapshot()}
      
      {showTutorial && renderTutorial()}
      
      <div className="mt-6 font-retro text-xs text-gray-600">
        &copy; 2025 BA Career Quest - 8-Bit Edition
      </div>
    </div>
  );
};

export default StartScreen;
