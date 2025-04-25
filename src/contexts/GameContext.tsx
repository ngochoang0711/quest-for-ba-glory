import React, { createContext, useContext, useReducer, useEffect } from 'react';
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

// Local Storage key
const GAME_STATE_STORAGE_KEY = 'ba-career-quest-state';

// Initial state
const initialState: GameState = {
  stage: 'start',
  character: null,
  currentScenario: null,
  completedScenarios: [],
  choiceResult: null,
  skillCategories: SKILL_CATEGORIES,
};

// Load saved state from localStorage
const loadSavedState = (): GameState | null => {
  try {
    const savedState = localStorage.getItem(GAME_STATE_STORAGE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      return parsedState;
    }
    return null;
  } catch (error) {
    console.error('Error loading saved game:', error);
    return null;
  }
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
  | { type: 'RETURN_TO_MAP' }
  | { type: 'SAVE_GAME' };

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  let newState: GameState;
  
  switch (action.type) {
    case 'START_GAME':
      newState = {
        ...state,
        stage: 'character',
      };
      break;
    case 'SELECT_CHARACTER':
      newState = {
        ...state,
        character: action.payload,
        stage: 'map',
      };
      break;
    case 'START_SCENARIO':
      newState = {
        ...state,
        currentScenario: action.payload,
        stage: 'scenario',
        choiceResult: null,
      };
      break;
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
      
      newState = {
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
      break;
    }
    case 'CONTINUE_TO_MAP':
      newState = {
        ...state,
        stage: 'map',
        currentScenario: null,
      };
      break;
    case 'RESET_GAME':
      // Clear localStorage when resetting
      localStorage.removeItem(GAME_STATE_STORAGE_KEY);
      newState = initialState;
      break;

    // Actions for skill tree
    case 'OPEN_SKILL_TREE':
      newState = {
        ...state,
        stage: 'skilltree',
      };
      break;
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

      newState = {
        ...state,
        character: {
          ...character,
          skills: updatedSkills,
          skillPoints: character.skillPoints - 1,
        },
      };
      break;
    }
    case 'RETURN_TO_MAP':
      newState = {
        ...state,
        stage: 'map',
      };
      break;
    case 'SAVE_GAME':
      // Just return current state, but will trigger save in useEffect
      newState = { ...state };
      break;
    default:
      return state;
  }
  
  // Save state to localStorage after each action
  try {
    localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(newState));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
  
  return newState;
}

// Context
type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  availableCharacters: BACharacter[];
  scenarios: Scenario[];
  resetGame: () => void;
  saveGame: () => void;
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
  // New Level 2 Scenarios
  {
    id: 'conflicting-stakeholders',
    title: 'Conflicting Stakeholder Demands',
    description: 'Sales wants more features, Engineering wants to fix technical debt, and Finance wants to cut costs. As a Senior BA, how do you facilitate alignment?',
    level: 2,
    npcName: 'Department Heads',
    npcSprite: '👥',
    choices: [
      {
        id: 'joint-workshop',
        text: 'Organize a joint prioritization workshop with all stakeholders',
        skillRequirements: [
          { skillId: 'communication', minLevel: 4 },
          { skillId: 'negotiation', minLevel: 3 }
        ],
        outcomes: {
          experience: 60,
          skillIncrease: [
            { skillId: 'negotiation', amount: 2 },
            { skillId: 'communication', amount: 2 },
          ],
          resultText: 'Your workshop created a platform for departments to understand each other\'s constraints. By facilitating constructive dialogue, you helped them reach a compromise that balanced new features with technical improvements.',
        },
      },
      {
        id: 'cost-benefit',
        text: 'Conduct a detailed cost-benefit analysis of all proposed work',
        skillRequirements: [
          { skillId: 'analysis', minLevel: 5 },
          { skillId: 'documentation', minLevel: 4 }
        ],
        outcomes: {
          experience: 55,
          skillIncrease: [
            { skillId: 'analysis', amount: 2 },
            { skillId: 'documentation', amount: 1 },
            { skillId: 'technical', amount: 1 },
          ],
          resultText: 'Your thorough analysis quantified the business value of features versus technical improvements. The data-driven approach convinced Finance to allocate resources more strategically, satisfying both Sales and Engineering.',
        },
      },
      {
        id: 'escalate',
        text: 'Escalate to executive leadership to make the final decision',
        skillRequirements: [
          { skillId: 'documentation', minLevel: 3 }
        ],
        outcomes: {
          experience: 35,
          skillIncrease: [
            { skillId: 'documentation', amount: 1 },
          ],
          resultText: 'Leadership appreciated your clear summary of the situation but was disappointed you didn\'t attempt to resolve the conflict first. Next time, try facilitating a collaborative solution before escalating.',
        },
      },
    ],
  },
  {
    id: 'agile-backlog',
    title: 'Agile Backlog Prioritization',
    description: 'Your team has accumulated a massive product backlog with conflicting priorities. The Product Owner is overwhelmed and the sprint planning session is tomorrow.',
    level: 2,
    npcName: 'Product Owner',
    npcSprite: '🧑‍💻',
    choices: [
      {
        id: 'value-mapping',
        text: 'Facilitate a value-mapping session to identify highest-impact items',
        skillRequirements: [
          { skillId: 'agile', minLevel: 4 },
          { skillId: 'analysis', minLevel: 3 }
        ],
        outcomes: {
          experience: 55,
          skillIncrease: [
            { skillId: 'agile', amount: 2 },
            { skillId: 'requirements', amount: 1 },
            { skillId: 'analysis', amount: 1 },
          ],
          resultText: 'The value-mapping exercise helped the team visualize business value versus effort. This clarity enabled the Product Owner to confidently prioritize the backlog, resulting in a focused sprint planning session.',
        },
      },
      {
        id: 'refine-epics',
        text: 'Work with the Product Owner to consolidate stories into strategic epics',
        skillRequirements: [
          { skillId: 'requirements', minLevel: 5 },
          { skillId: 'communication', minLevel: 3 }
        ],
        outcomes: {
          experience: 50,
          skillIncrease: [
            { skillId: 'requirements', amount: 2 },
            { skillId: 'agile', amount: 2 },
          ],
          resultText: 'By organizing the backlog into coherent epics, you created strategic themes that made prioritization more manageable. The Product Owner appreciated having a structured backlog that aligned with business objectives.',
        },
      },
      {
        id: 'technical-first',
        text: 'Recommend prioritizing technical debt to improve velocity later',
        skillRequirements: [
          { skillId: 'technical', minLevel: 4 }
        ],
        outcomes: {
          experience: 40,
          skillIncrease: [
            { skillId: 'technical', amount: 2 },
            { skillId: 'process', amount: 1 },
          ],
          resultText: 'While your technical assessment was sound, prioritizing technical debt without clear business value justification created tension with stakeholders. Consider balancing technical concerns with visible business outcomes in the future.',
        },
      },
    ],
  },
  {
    id: 'vendor-integration',
    title: 'Vendor Integration Kickoff',
    description: 'Your company is integrating a new vendor\'s software system. You need to lead the kickoff meeting and establish the integration approach.',
    level: 2,
    npcName: 'Vendor Representative',
    npcSprite: '👨‍💻',
    choices: [
      {
        id: 'joint-planning',
        text: 'Establish a joint planning team with vendor and internal experts',
        skillRequirements: [
          { skillId: 'communication', minLevel: 4 },
          { skillId: 'technical', minLevel: 3 }
        ],
        outcomes: {
          experience: 60,
          skillIncrease: [
            { skillId: 'communication', amount: 2 },
            { skillId: 'technical', amount: 2 },
            { skillId: 'process', amount: 1 },
          ],
          resultText: 'The collaborative approach fostered strong relationships between teams. By bringing together diverse expertise, you identified integration challenges early and developed a comprehensive plan that both parties fully supported.',
        },
      },
      {
        id: 'detailed-requirements',
        text: 'Document detailed integration requirements and hand off to the vendor',
        skillRequirements: [
          { skillId: 'documentation', minLevel: 5 },
          { skillId: 'requirements', minLevel: 4 }
        ],
        outcomes: {
          experience: 50,
          skillIncrease: [
            { skillId: 'documentation', amount: 2 },
            { skillId: 'requirements', amount: 2 },
          ],
          resultText: 'Your thorough requirements document provided clear direction, but the hands-off approach missed opportunities for collaboration. The vendor delivered according to specifications, but several assumptions had to be corrected during implementation.',
        },
      },
      {
        id: 'agile-iterations',
        text: 'Propose an iterative approach with bi-weekly demos and feedback',
        skillRequirements: [
          { skillId: 'agile', minLevel: 4 },
          { skillId: 'communication', minLevel: 3 }
        ],
        outcomes: {
          experience: 55,
          skillIncrease: [
            { skillId: 'agile', amount: 2 },
            { skillId: 'communication', amount: 1 },
            { skillId: 'process', amount: 1 },
          ],
          resultText: 'The iterative approach was initially met with resistance from the vendor but proved highly effective. Regular demonstrations caught misalignments early, and the integration progressed smoothly with minimal rework.',
        },
      },
    ],
  },
  // New Level 1 Scenario
  {
    id: 'process-improvement',
    title: 'Process Improvement Challenge',
    description: 'The team needs to streamline their requirements gathering process. What approach do you suggest?',
    level: 1,
    npcName: 'Process Improvement Manager',
    npcSprite: '👨‍💻',
    choices: [
      {
        id: 'template-standardization',
        text: 'Create standardized templates for all documentation',
        outcomes: {
          experience: 35,
          skillIncrease: [
            { skillId: 'documentation', amount: 2 },
            { skillId: 'process', amount: 1 },
          ],
          resultText: 'Your standardized templates improved documentation quality and reduced the time needed for requirements gathering by 20%.',
        },
      },
      {
        id: 'automation-tools',
        text: 'Implement automation tools for requirements management',
        outcomes: {
          experience: 40,
          skillIncrease: [
            { skillId: 'technical', amount: 2 },
            { skillId: 'process', amount: 2 },
          ],
          resultText: 'The automation tools you implemented significantly reduced manual effort and improved requirements traceability across the organization.',
        },
      },
      {
        id: 'agile-adoption',
        text: 'Adopt agile methodologies for faster feedback cycles',
        outcomes: {
          experience: 45,
          skillIncrease: [
            { skillId: 'agile', amount: 3 },
            { skillId: 'process', amount: 1 },
          ],
          resultText: 'The transition to agile methodologies was challenging but ultimately successful, resulting in faster delivery and better stakeholder alignment.',
        },
      },
    ],
  },
  
  // New Level 1 Scenario
  {
    id: 'technical-feasibility',
    title: 'Technical Feasibility Study',
    description: 'Stakeholders have requested a new feature, but the development team is concerned about technical feasibility. How do you proceed?',
    level: 1,
    npcName: 'Lead Developer',
    npcSprite: '👩‍💻',
    choices: [
      {
        id: 'detailed-analysis',
        text: 'Conduct a detailed technical analysis with the development team',
        outcomes: {
          experience: 30,
          skillIncrease: [
            { skillId: 'technical', amount: 2 },
            { skillId: 'analysis', amount: 1 },
          ],
          resultText: 'Your analysis revealed key technical constraints that helped refine the feature request into something more feasible while still meeting business needs.',
        },
      },
      {
        id: 'prototype',
        text: 'Create a prototype to test the concept',
        outcomes: {
          experience: 35,
          skillIncrease: [
            { skillId: 'technical', amount: 1 },
            { skillId: 'requirements', amount: 2 },
          ],
          resultText: 'The prototype demonstrated both the possibilities and limitations of the feature, helping stakeholders understand what was truly feasible.',
        },
      },
      {
        id: 'alternatives',
        text: 'Explore alternative solutions with the stakeholders',
        outcomes: {
          experience: 40,
          skillIncrease: [
            { skillId: 'communication', amount: 2 },
            { skillId: 'negotiation', amount: 1 },
          ],
          resultText: 'By exploring alternatives, you found a solution that was both technically feasible and met the business needs, resulting in a win-win outcome.',
        },
      },
    ],
  },
  
  // New Level 2 Scenario
  {
    id: 'data-governance',
    title: 'Data Governance Initiative',
    description: 'Your organization is implementing a data governance framework. As a senior BA, you need to help define business data policies and standards.',
    level: 2,
    npcName: 'Chief Data Officer',
    npcSprite: '👩‍💼',
    choices: [
      {
        id: 'cross-functional',
        text: 'Establish a cross-functional data governance committee',
        skillRequirements: [
          { skillId: 'communication', minLevel: 4 },
          { skillId: 'process', minLevel: 3 }
        ],
        outcomes: {
          experience: 55,
          skillIncrease: [
            { skillId: 'communication', amount: 2 },
            { skillId: 'process', amount: 2 },
          ],
          resultText: 'Your committee brought together diverse perspectives from across the organization, resulting in comprehensive data governance policies with strong buy-in from all departments.',
        },
      },
      {
        id: 'metadata-catalog',
        text: 'Develop a business metadata catalog to document all key data elements',
        skillRequirements: [
          { skillId: 'documentation', minLevel: 5 },
          { skillId: 'technical', minLevel: 3 }
        ],
        outcomes: {
          experience: 60,
          skillIncrease: [
            { skillId: 'documentation', amount: 2 },
            { skillId: 'technical', amount: 2 },
            { skillId: 'analysis', amount: 1 },
          ],
          resultText: 'Your metadata catalog became the definitive source of truth for data definitions across the organization, significantly improving data quality and consistency.',
        },
      },
      {
        id: 'compliance-focus',
        text: 'Focus on regulatory compliance requirements first',
        skillRequirements: [
          { skillId: 'analysis', minLevel: 4 }
        ],
        outcomes: {
          experience: 45,
          skillIncrease: [
            { skillId: 'analysis', amount: 2 },
            { skillId: 'documentation', amount: 1 },
          ],
          resultText: 'Your compliance-first approach ensured the organization met all regulatory requirements, but a more holistic approach might have yielded additional business benefits.',
        },
      },
    ],
  },
];

export function GameProvider({ children }: { children: React.ReactNode }) {
  // Try to load saved state, fall back to initial state if not available
  const savedState = loadSavedState();
  const [state, dispatch] = useReducer(gameReducer, savedState || initialState);

  // Helper functions for common actions
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  const saveGame = () => {
    dispatch({ type: 'SAVE_GAME' });
  };

  const value = {
    state,
    dispatch,
    availableCharacters: DEFAULT_CHARACTERS,
    scenarios: SCENARIOS,
    resetGame,
    saveGame,
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
