// Game types

export type BASkill = {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  description?: string;
  icon?: string;
};

export type SkillCategory = {
  id: string;
  name: string;
  skills: string[]; // Skill IDs in this category
};

export type BATool = {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  levelRequired: number;
  unlocked: boolean;
};

export type BACharacter = {
  id: string;
  name: string;
  sprite: string;
  level: number;
  experience: number;
  skills: BASkill[];
  skillPoints: number; // Available skill points to allocate
  tools: BATool[]; // Add tools to character
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
  toolReward?: string; // Add optional tool reward
};

export type GameStage = "start" | "character" | "map" | "scenario" | "result" | "skilltree" | "journal";

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
    toolUnlocked?: string; // Add optional tool unlock notification
  } | null;
  skillCategories: SkillCategory[]; // New field for organizing skills
};
