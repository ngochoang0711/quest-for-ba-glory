
import React, { createContext, useContext, useReducer } from 'react';
import { GameState, BACharacter, Scenario, ScenarioChoice, SkillCategory } from '@/types/game';

// Default skills for all characters
const DEFAULT_SKILLS = [
  { id: 'requirements', name: 'Requirements Gathering', level: 1, maxLevel: 10, description: 'Ability to elicit, document, and verify requirements from stakeholders' },
  { id: 'analysis', name: 'Data Analysis', level: 1, maxLevel: 10, description: 'Skill in analyzing and interpreting complex data sets to derive insights' },
  { id: 'communication', name: 'Stakeholder Communication', level: 1, maxLevel: 10, description: 'Effectiveness in conveying information clearly to different stakeholders' },
  { id: 'documentation', name: 'Documentation', level: 1, maxLevel: 10, description: 'Proficiency in creating clear, comprehensive business and technical documents' },
  { id: 'technical', name: 'Technical Knowledge', level: 1, maxLevel: 10, description: 'Understanding of technical concepts and systems relevant to the business domain' },
  { id: 'process', name: 'Process Optimization', level: 0, maxLevel: 10, description: 'Ability to identify and implement improvements to business processes' },
  { id: 'agile', name: 'Agile Methodologies', level: 0, maxLevel: 10, description: 'Knowledge and application of Agile frameworks and practices' },
  { id: 'negotiation', name: 'Negotiation', level: 0, maxLevel: 10, description: 'Skill in facilitating agreements between conflicting stakeholder needs' },
];

// Skill categories
const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'core',
    name: 'Core BA Skills',
    skills: ['requirements', 'analysis', 'documentation'],
  },
  {
    id: 'interpersonal',
    name: 'Interpersonal Skills',
    skills: ['communication', 'negotiation'],
  },
  {
    id: 'technical',
    name: 'Technical Skills',
    skills: ['technical', 'process', 'agile'],
  },
];

// Default characters
const DEFAULT_CHARACTERS: BACharacter[] = [
  {
    id: 'rookie',
    name: 'Rookie Analyst',
    sprite: '👨‍💼',
    level: 1,
    experience: 0,
    skills: DEFAULT_SKILLS,
    skillPoints: 3,
  },
  {
    id: 'veteran',
    name: 'Veteran Analyst',
    sprite: '👩‍💼',
    level: 1,
    experience: 0,
    skills: DEFAULT_SKILLS,
    skillPoints: 5,
  },
];

// Initial state
const initialState: GameState = {
  stage: 'start',
  character: null,
  currentScenario: null,
  completedScenarios: [],
  choiceResult: null,
  skillCategories: SKILL_CATEGORIES,
};

// Actions
type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SELECT_CHARACTER'; payload: BACharacter }
  | { type: 'START_SCENARIO'; payload: Scenario }
  | { type: 'MAKE_CHOICE'; payload: ScenarioChoice }
  | { type: 'CONTINUE_TO_MAP' }
  | { type: 'RESET_GAME' }
  | { type: 'OPEN_SKILL_TREE' }
  | { type: 'ALLOCATE_SKILL_POINT'; payload: { skillId: string } }
  | { type: 'RETURN_TO_MAP' };

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        stage: 'character',
      };
    case 'SELECT_CHARACTER':
      return {
        ...state,
        character: action.payload,
        stage: 'map',
      };
    case 'START_SCENARIO':
      return {
        ...state,
        currentScenario: action.payload,
        stage: 'scenario',
        choiceResult: null,
      };
    case 'MAKE_CHOICE': {
      const choice = action.payload;
      const character = state.character!;
      
      // Calculate experience gain
      const experienceGain = choice.outcomes.experience;
      
      // Calculate skill increases
      const skillsIncreased = choice.outcomes.skillIncrease.map(increase => {
        const skill = character.skills.find(s => s.id === increase.skillId)!;
        return {
          skillId: skill.id,
          name: skill.name,
          amount: increase.amount,
        };
      });
      
      // Update character skills
      const updatedSkills = character.skills.map(skill => {
        const increase = choice.outcomes.skillIncrease.find(
          inc => inc.skillId === skill.id
        );
        if (increase) {
          return {
            ...skill,
            level: Math.min(skill.level + increase.amount, skill.maxLevel),
          };
        }
        return skill;
      });
      
      // Calculate if character should level up (every 100 XP)
      const newExperience = character.experience + experienceGain;
      const currentLevel = Math.floor(character.experience / 100) + 1;
      const newLevel = Math.floor(newExperience / 100) + 1;
      const leveledUp = newLevel > currentLevel;

      // Award skill points if leveled up
      const newSkillPoints = character.skillPoints + (leveledUp ? 2 : 0);
      
      return {
        ...state,
        character: {
          ...character,
          level: newLevel,
          experience: newExperience,
          skills: updatedSkills,
          skillPoints: newSkillPoints,
        },
        stage: 'result',
        completedScenarios: [...state.completedScenarios, state.currentScenario!.id],
        choiceResult: {
          text: choice.outcomes.resultText,
          experience: experienceGain,
          skillsIncreased,
        },
      };
    }
    case 'CONTINUE_TO_MAP':
      return {
        ...state,
        stage: 'map',
        currentScenario: null,
      };
    case 'RESET_GAME':
      return initialState;

    // New actions for skill tree
    case 'OPEN_SKILL_TREE':
      return {
        ...state,
        stage: 'skilltree',
      };
    case 'ALLOCATE_SKILL_POINT': {
      const character = state.character!;
      if (character.skillPoints <= 0) return state;

      const updatedSkills = character.skills.map(skill => {
        if (skill.id === action.payload.skillId && skill.level < skill.maxLevel) {
          return {
            ...skill,
            level: skill.level + 1,
          };
        }
        return skill;
      });

      return {
        ...state,
        character: {
          ...character,
          skills: updatedSkills,
          skillPoints: character.skillPoints - 1,
        },
      };
    }
    case 'RETURN_TO_MAP':
      return {
        ...state,
        stage: 'map',
      };
    default:
      return state;
  }
}

// Context
type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  availableCharacters: BACharacter[];
  scenarios: Scenario[];
};

const GameContext = createContext<GameContextType | undefined>(undefined);

// Sample scenarios
const SCENARIOS: Scenario[] = [
  {
    id: 'junior-requirements',
    title: 'The Missing Requirements',
    description: 'The development team is waiting for requirements, but stakeholders are giving conflicting information. How do you proceed?',
    level: 1,
    npcName: 'Project Manager',
    npcSprite: '👨‍💼',
    choices: [
      {
        id: 'document',
        text: 'Document everything and present conflicts back to stakeholders',
        outcomes: {
          experience: 30,
          skillIncrease: [
            { skillId: 'documentation', amount: 2 },
            { skillId: 'communication', amount: 1 },
          ],
          resultText: 'You carefully documented the conflicting requirements and presented them to stakeholders. This helped identify misunderstandings and led to clearer requirements.',
        },
      },
      {
        id: 'workshop',
        text: 'Organize a requirements workshop with all stakeholders',
        outcomes: {
          experience: 40,
          skillIncrease: [
            { skillId: 'communication', amount: 2 },
            { skillId: 'requirements', amount: 2 },
          ],
          resultText: 'Your workshop was a success! By bringing everyone together, you helped stakeholders align on their needs and produced clear requirements.',
        },
      },
      {
        id: 'assume',
        text: 'Make assumptions and move forward to meet the deadline',
        outcomes: {
          experience: 10,
          skillIncrease: [
            { skillId: 'technical', amount: 1 },
          ],
          resultText: 'Your assumptions led to rework later when stakeholders saw the result. While you met the deadline, the quality suffered.',
        },
      },
    ],
  },
  {
    id: 'data-analysis',
    title: 'The Data Dilemma',
    description: 'You need to analyze customer data to identify patterns, but the data is messy and incomplete. What approach do you take?',
    level: 1,
    npcName: 'Data Scientist',
    npcSprite: '👩‍🔬',
    choices: [
      {
        id: 'clean-analyze',
        text: 'Spend time cleaning the data before analyzing',
        outcomes: {
          experience: 35,
          skillIncrease: [
            { skillId: 'analysis', amount: 2 },
            { skillId: 'technical', amount: 1 },
          ],
          resultText: 'Your clean data set produced reliable insights. The extra time invested paid off with trustworthy recommendations.',
        },
      },
      {
        id: 'partial-analysis',
        text: 'Analyze only the complete records to save time',
        outcomes: {
          experience: 20,
          skillIncrease: [
            { skillId: 'analysis', amount: 1 },
          ],
          resultText: 'Your analysis was quick but missed important patterns from the incomplete data. The partial view gave some insight but wasn\'t comprehensive.',
        },
      },
      {
        id: 'outsource',
        text: 'Ask the data team to prepare the data for you',
        outcomes: {
          experience: 15,
          skillIncrease: [
            { skillId: 'communication', amount: 1 },
          ],
          resultText: 'The data team helped, but they had their own priorities. Your analysis was delayed, but the data quality was good.',
        },
      },
    ],
  },
];

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const value = {
    state,
    dispatch,
    availableCharacters: DEFAULT_CHARACTERS,
    scenarios: SCENARIOS,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
