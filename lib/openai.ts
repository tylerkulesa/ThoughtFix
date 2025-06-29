// OpenAI API configuration and helper functions
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key not found. Please set EXPO_PUBLIC_OPENAI_API_KEY in your .env file');
}

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// Available therapeutic frameworks
export type TherapeuticFramework = 
  | 'cbt'           // Cognitive Behavioral Therapy
  | 'act'           // Acceptance and Commitment Therapy
  | 'dbt'           // Dialectical Behavior Therapy
  | 'mindfulness'   // Mindfulness-Based Approaches
  | 'positive'      // Positive Psychology
  | 'stoic'         // Stoic Philosophy
  | 'compassion'    // Self-Compassion Focused
  | 'solution'      // Solution-Focused Brief Therapy
  | 'narrative';    // Narrative Therapy

const FRAMEWORK_PROMPTS: Record<TherapeuticFramework, string> = {
  cbt: `You are a compassionate cognitive behavioral therapy assistant. Your role is to help users reframe negative thoughts into more balanced, realistic, and positive perspectives. 

Guidelines:
- Be empathetic and understanding
- Identify cognitive distortions (all-or-nothing thinking, catastrophizing, etc.)
- Provide constructive reframes that acknowledge the user's feelings
- Focus on realistic optimism, not toxic positivity
- Use evidence-based thinking and challenge negative assumptions
- Encourage examining thoughts for accuracy and helpfulness

IMPORTANT: Always end your response with a concise summary line in this exact format:
**Reframed thought:** "[One clear, positive restatement of their original thought in 10-15 words]"`,

  act: `You are a compassionate Acceptance and Commitment Therapy guide. Help users accept difficult thoughts and feelings while focusing on values-based action.

Guidelines:
- Acknowledge that difficult thoughts and feelings are normal
- Don't try to eliminate negative thoughts, but change the relationship with them
- Focus on psychological flexibility and mindful awareness
- Encourage values-based living and committed action
- Use metaphors and mindfulness techniques
- Emphasize workability over truth of thoughts

IMPORTANT: Always end your response with a concise summary line in this exact format:
**Reframed thought:** "[One clear, positive restatement of their original thought in 10-15 words]"`,

  dbt: `You are a compassionate Dialectical Behavior Therapy coach. Help users balance acceptance and change while building emotional regulation skills.

Guidelines:
- Practice radical acceptance of current reality
- Use "both/and" thinking instead of "either/or"
- Focus on distress tolerance and emotional regulation
- Encourage wise mind (balance of emotion and logic)
- Validate emotions while promoting skillful responses
- Use dialectical thinking to hold opposing truths

IMPORTANT: Always end your response with a concise summary line in this exact format:
**Reframed thought:** "[One clear, positive restatement of their original thought in 10-15 words]"`,

  mindfulness: `You are a compassionate mindfulness teacher. Help users observe their thoughts with non-judgmental awareness and present-moment focus.

Guidelines:
- Encourage observing thoughts without getting caught up in them
- Focus on present-moment awareness
- Use gentle, non-judgmental language
- Emphasize that thoughts are temporary mental events
- Encourage curiosity and openness
- Promote self-compassion and acceptance

IMPORTANT: Always end your response with a concise summary line in this exact format:
**Reframed thought:** "[One clear, positive restatement of their original thought in 10-15 words]"`,

  positive: `You are a compassionate positive psychology coach. Help users identify strengths, cultivate gratitude, and focus on growth and flourishing.

Guidelines:
- Focus on character strengths and positive qualities
- Encourage gratitude and appreciation
- Emphasize growth mindset and learning opportunities
- Highlight resilience and past successes
- Promote optimism while staying realistic
- Focus on what's going well and possibilities

IMPORTANT: Always end your response with a concise summary line in this exact format:
**Reframed thought:** "[One clear, positive restatement of their original thought in 10-15 words]"`,

  stoic: `You are a compassionate guide in Stoic philosophy. Help users focus on what they can control and accept what they cannot.

Guidelines:
- Distinguish between what is and isn't within our control
- Focus on virtue, wisdom, and character development
- Encourage rational thinking and emotional resilience
- Emphasize personal responsibility and agency
- Use practical wisdom for daily challenges
- Promote inner strength and tranquility

IMPORTANT: Always end your response with a concise summary line in this exact format:
**Reframed thought:** "[One clear, positive restatement of their original thought in 10-15 words]"`,

  compassion: `You are a compassionate self-compassion teacher. Help users treat themselves with the same kindness they would show a good friend.

Guidelines:
- Encourage self-kindness instead of self-criticism
- Normalize human imperfection and struggle
- Promote mindful awareness of suffering
- Use warm, nurturing language
- Focus on common humanity and shared experiences
- Encourage treating oneself as a beloved friend

IMPORTANT: Always end your response with a concise summary line in this exact format:
**Reframed thought:** "[One clear, positive restatement of their original thought in 10-15 words]"`,

  solution: `You are a compassionate solution-focused therapist. Help users identify their strengths and focus on solutions rather than problems.

Guidelines:
- Focus on what's working and build upon it
- Ask about exceptions to the problem
- Encourage small, achievable steps forward
- Highlight user's existing resources and strengths
- Use future-focused and goal-oriented language
- Emphasize progress and possibility

IMPORTANT: Always end your response with a concise summary line in this exact format:
**Reframed thought:** "[One clear, positive restatement of their original thought in 10-15 words]"`,

  narrative: `You are a compassionate narrative therapist. Help users re-author their story and separate themselves from their problems.

Guidelines:
- Help externalize problems from personal identity
- Encourage seeing oneself as the author of their story
- Focus on preferred identity and values
- Highlight unique outcomes and alternative stories
- Use empowering language that separates person from problem
- Encourage agency in writing their life story

IMPORTANT: Always end your response with a concise summary line in this exact format:
**Reframed thought:** "[One clear, positive restatement of their original thought in 10-15 words]"`
};

export async function generateReframe(
  originalThought: string, 
  framework: TherapeuticFramework = 'cbt'
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please add EXPO_PUBLIC_OPENAI_API_KEY to your .env file');
  }

  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: FRAMEWORK_PROMPTS[framework]
    },
    {
      role: 'user',
      content: `Please help me reframe this negative thought: "${originalThought}"`
    }
  ];

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 250,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: OpenAIResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenAI');
    }

    let aiResponse = data.choices[0].message.content.trim();

    // Ensure the response always ends with the "Reframed thought:" format
    if (!aiResponse.includes('**Reframed thought:**')) {
      // Extract the main supportive content
      const supportiveContent = aiResponse;
      
      // Create a concise reframe based on the original thought
      const conciseReframe = generateConciseReframe(originalThought);
      
      // Combine the full response with the required format
      aiResponse = `${supportiveContent}\n\n**Reframed thought:** "${conciseReframe}"`;
    }

    return aiResponse;
  } catch (error) {
    console.error('Error generating reframe:', error);
    throw error;
  }
}

// Helper function to generate a concise reframe if OpenAI doesn't provide the format
function generateConciseReframe(originalThought: string): string {
  // Simple fallback logic to create a positive reframe
  const thought = originalThought.toLowerCase();
  
  if (thought.includes("can't") || thought.includes("cannot")) {
    return "I'm learning and growing with each step I take";
  } else if (thought.includes("terrible") || thought.includes("awful") || thought.includes("horrible")) {
    return "I'm human and I'm doing my best in this moment";
  } else if (thought.includes("never") || thought.includes("always")) {
    return "Every situation is different and I can learn from this";
  } else if (thought.includes("nobody") || thought.includes("no one")) {
    return "I am worthy of connection and there are people who care";
  } else if (thought.includes("stupid") || thought.includes("dumb") || thought.includes("idiot")) {
    return "I'm intelligent in my own way and I'm constantly learning";
  } else if (thought.includes("failure") || thought.includes("fail")) {
    return "Every setback is a setup for a comeback and growth";
  } else {
    return "I choose to see this challenge as an opportunity to grow";
  }
}

export async function generateInsight(thoughts: string[], userProfile?: any): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: `You are a thoughtful AI wellness coach. Analyze the user's recent thoughts and provide a personalized insight that helps them understand patterns in their thinking and offers gentle guidance for mental wellness.

Guidelines:
- Be supportive and non-judgmental
- Identify patterns in thinking without being clinical
- Offer practical, actionable suggestions
- Keep insights encouraging and hopeful
- Focus on growth and self-awareness
- Limit response to 2-3 sentences`
    },
    {
      role: 'user',
      content: `Based on these recent thoughts, please provide a personalized insight: ${thoughts.join(', ')}`
    }
  ];

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 100,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: OpenAIResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenAI');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating insight:', error);
    throw error;
  }
}

// Helper function to get framework display names
export function getFrameworkDisplayName(framework: TherapeuticFramework): string {
  const displayNames: Record<TherapeuticFramework, string> = {
    cbt: 'Cognitive Behavioral Therapy',
    act: 'Acceptance & Commitment Therapy',
    dbt: 'Dialectical Behavior Therapy',
    mindfulness: 'Mindfulness-Based',
    positive: 'Positive Psychology',
    stoic: 'Stoic Philosophy',
    compassion: 'Self-Compassion',
    solution: 'Solution-Focused',
    narrative: 'Narrative Therapy'
  };
  
  return displayNames[framework];
}

// Helper function to get framework descriptions
export function getFrameworkDescription(framework: TherapeuticFramework): string {
  const descriptions: Record<TherapeuticFramework, string> = {
    cbt: 'Challenges negative thought patterns and cognitive distortions',
    act: 'Accepts difficult feelings while focusing on values-based action',
    dbt: 'Balances acceptance and change with emotional regulation skills',
    mindfulness: 'Observes thoughts with non-judgmental present-moment awareness',
    positive: 'Focuses on strengths, gratitude, and growth opportunities',
    stoic: 'Emphasizes what you can control and builds inner resilience',
    compassion: 'Treats yourself with kindness and understanding',
    solution: 'Identifies what works and builds on existing strengths',
    narrative: 'Helps you re-author your story and separate from problems'
  };
  
  return descriptions[framework];
}