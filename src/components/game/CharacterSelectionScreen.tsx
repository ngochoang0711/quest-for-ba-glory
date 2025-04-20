
import React, { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import CharacterCard from "./CharacterCard";
import PixelButton from "./PixelButton";
import DialogBox from "./DialogBox";

const CharacterSelectionScreen = () => {
  const { availableCharacters, dispatch } = useGame();
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const handleSelectCharacter = (characterId: string) => {
    setSelectedCharacter(characterId);
  };

  const handleConfirm = () => {
    if (!selectedCharacter) return;
    
    const character = availableCharacters.find(c => c.id === selectedCharacter);
    if (character) {
      dispatch({ 
        type: 'SELECT_CHARACTER', 
        payload: character 
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="game-title mb-6">Choose Your Analyst</h1>
      
      <DialogBox className="mb-8 max-w-lg">
        <p className="font-retro text-sm text-game-pixel-black mb-2">
          Select your character to begin your BA career journey:
        </p>
      </DialogBox>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full max-w-2xl">
        {availableCharacters.map(character => (
          <CharacterCard
            key={character.id}
            character={character}
            selected={selectedCharacter === character.id}
            onClick={() => handleSelectCharacter(character.id)}
          />
        ))}
      </div>

      <PixelButton
        color="green"
        onClick={handleConfirm}
        className={selectedCharacter ? "" : "opacity-50 cursor-not-allowed"}
      >
        Confirm Selection
      </PixelButton>
    </div>
  );
};

export default CharacterSelectionScreen;
