
import React from "react";
import { useGame } from "@/contexts/GameContext";
import PixelButton from "./PixelButton";
import DialogBox from "./DialogBox";
import PixelProgressBar from "./PixelProgressBar";
import { Check, Trophy, MapPin, Lock, Users, MessageSquare, Handshake, Layers, ChartBar } from "lucide-react";

const MapScreen = () => {
  const { state, scenarios, dispatch } = useGame();
  const { character, completedScenarios } = state;

  if (!character) return null;

  // Filter scenarios by character level (only show scenarios that match character level or lower)
  const availableScenarios = scenarios.filter(
    scenario => scenario.level <= character.level
  );

  const handleStartScenario = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      dispatch({ type: 'START_SCENARIO', payload: scenario });
    }
  };

  // Function to get a scenario's visual element based on its ID and level
  const getScenarioVisual = (scenario: typeof scenarios[0]) => {
    const { id, level } = scenario;
    
    // Level 2 scenarios
    if (level === 2) {
      if (id.includes('stakeholder')) {
        return <Users size={24} className="text-game-purple-dark" />;
      } else if (id.includes('agile')) {
        return <Layers size={24} className="text-game-purple-dark" />;
      } else if (id.includes('vendor')) {
        return <Handshake size={24} className="text-game-purple-dark" />;
      } else {
        return <ChartBar size={24} className="text-game-purple-dark" />;
      }
    }
    
    // Level 1 scenarios
    if (id === 'junior-requirements') {
      return '🏢';
    } else if (id === 'data-analysis') {
      return '🖥️';
    } else {
      return <MessageSquare size={24} className="text-game-blue-dark" />;
    }
  };

  // Function to get background color class based on completion status and level
  const getLocationClass = (scenario: typeof scenarios[0]) => {
    const isCompleted = completedScenarios.includes(scenario.id);
    const isLevel2 = scenario.level === 2;
    
    if (isCompleted) {
      return isLevel2 
        ? "bg-opacity-20 bg-game-purple-light border-game-purple-dark" 
        : "bg-opacity-20 bg-game-green-light border-game-green-dark";
    } else {
      return isLevel2 
        ? "bg-opacity-10 bg-game-purple-light border-game-purple-dark" 
        : "bg-opacity-10 bg-game-blue-light border-game-blue-dark";
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
            <div className={`${character.level >= 2 ? 'level-badge-purple' : 'level-badge'}`}>
              Level {character.level}
            </div>
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
            color={character.level >= 2 ? "purple" : "blue"} 
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
          {character.level >= 2 
            ? "Senior BA challenges require advanced skills. Choose wisely to demonstrate your leadership abilities:"
            : "Explore the career map and choose your next challenge:"}
        </p>
      </DialogBox>

      {/* Interactive Career Map */}
      <div className="w-full max-w-3xl mb-8 relative">
        <div className="pixel-container p-6 bg-white relative">
          {/* Map background with grid */}
          <div className="absolute inset-0 bg-game-pixel-white border-4 border-game-pixel-black" style={{ 
            backgroundImage: 'linear-gradient(rgba(200, 200, 200, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 200, 200, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px' 
          }}></div>
          
          {/* Map title */}
          <div className="relative mb-6 text-center">
            <h2 className="font-retro text-lg text-game-blue-dark">BA Corporate World</h2>
            <p className="text-xs font-retro text-gray-600">Select a location to start a challenge</p>
          </div>
          
          {/* Map with locations */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 z-10">
            {availableScenarios.map(scenario => {
              const isCompleted = completedScenarios.includes(scenario.id);
              const isLevel2 = scenario.level === 2;
              
              return (
                <div 
                  key={scenario.id} 
                  className={`pixel-location ${getLocationClass(scenario)} p-4 cursor-pointer transition-all hover:translate-y-[-2px] relative`}
                  onClick={() => handleStartScenario(scenario.id)}
                >
                  {/* Location Icon */}
                  <div className="absolute -top-5 -left-5 text-4xl z-20 float">
                    {getScenarioVisual(scenario)}
                  </div>
                  
                  {/* Completion Status */}
                  {isCompleted && (
                    <div className="absolute -top-3 -right-3 bg-game-green-light rounded-full p-1 border-2 border-game-pixel-black z-20">
                      <Check size={16} className="text-white" />
                    </div>
                  )}
                  
                  <div className="ml-8">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-retro text-sm">{scenario.title}</h3>
                      <span className={`${isLevel2 ? 'level-badge-purple' : 'level-badge'} text-xs`}>
                        Level {scenario.level}
                      </span>
                    </div>
                    
                    <p className="text-xs mb-4">{scenario.description}</p>
                    
                    <div className="flex justify-end">
                      <PixelButton
                        color={isLevel2 ? "purple" : isCompleted ? "green" : "blue"}
                        onClick={() => {
                          handleStartScenario(scenario.id);
                        }}
                        className="text-xs"
                      >
                        {isCompleted ? "Replay" : "Start"}
                      </PixelButton>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Locked/Future Locations */}
            {character.level <= 2 && (
              <div className="pixel-location bg-opacity-10 bg-gray-200 border-gray-400 p-4 relative opacity-70">
                <div className="absolute -top-5 -left-5 text-4xl z-20 blur-[1px]">
                  🏆
                </div>
                
                <div className="absolute -top-3 -right-3 bg-gray-400 rounded-full p-1 border-2 border-game-pixel-black z-20">
                  <Lock size={16} className="text-white" />
                </div>
                
                <div className="ml-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-retro text-sm">Strategic Initiative</h3>
                    <span className="level-badge text-xs bg-gray-400">Level 3</span>
                  </div>
                  
                  <p className="text-xs mb-4 blur-[1px]">Under construction... Level up to unlock!</p>
                  
                  <div className="flex justify-end">
                    <div className="text-xs font-retro text-gray-500">
                      Locked
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Map Legend */}
          <div className="mt-8 px-4 py-2 bg-white bg-opacity-80 border-2 border-dashed border-gray-300 inline-block">
            <h4 className="font-retro text-xs mb-2">Map Legend:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-game-green-light mr-2"></div>
                <span>Completed Level 1</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-game-blue-light mr-2"></div>
                <span>Available Level 1</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-game-purple-light mr-2"></div>
                <span>Level 2 (Senior BA)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-300 mr-2"></div>
                <span>Locked</span>
              </div>
            </div>
          </div>
        </div>
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
