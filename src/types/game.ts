
// Game types

export type BASkill = {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
};

export type BACharacter = {
  id: string;
  name: string;
  sprite: string;
  level: number;
  experience: number;
  skills: BASkill[];
};

export type ScenarioChoice = {
  id: string;
  text: string;
  skillRequirements?: Array<{
    skillId: string;
    minLevel: number;
  }>;
  outcomes: {
    experience: number;
    skillIncrease: Array<{
      skillId: string;
      amount: number;
    }>;
    nextScenarioId?: string;
    resultText: string;
  };
};

export type Scenario = {
  id: string;
  title: string;
  description: string;
  level: number;
  npcName?: string;
  npcSprite?: string;
  choices: ScenarioChoice[];
};

export type GameStage = "start" | "character" | "map" | "scenario" | "result";

export type GameState = {
  stage: GameStage;
  character: BACharacter | null;
  currentScenario: Scenario | null;
  completedScenarios: string[];
  choiceResult: {
    text: string;
    experience: number;
    skillsIncreased: Array<{
      skillId: string;
      name: string;
      amount: number;
    }>;
  } | null;
};
