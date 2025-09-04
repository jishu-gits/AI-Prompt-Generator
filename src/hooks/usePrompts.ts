import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDoc 
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export interface Prompt {
  id: string;
  title: string;
  subject: string;
  persona: string;
  goldenRule: string;
  processSteps: string[];
  additionalGuidelines?: string;
  generatedPrompt: string;
  createdBy: string;
  createdAt: Date;
}

export interface PromptTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  personaTemplate: string;
  goldenRuleTemplate: string;
  processStepsTemplate: string[];
  isDefault: boolean;
}

function generatePromptText(args: {
  persona: string;
  goldenRule: string;
  processSteps: string[];
  additionalGuidelines?: string;
}) {
  let prompt = `# Teaching Assistant Instructions\n\n`;
  
  prompt += `## Your Role\n${args.persona}\n\n`;
  
  prompt += `## Golden Rule\n${args.goldenRule}\n\n`;
  
  prompt += `## Your Teaching Process\nWhen a student asks for help with their code, follow these steps:\n\n`;
  
  args.processSteps.forEach((step, index) => {
    prompt += `${index + 1}. ${step}\n`;
  });
  
  if (args.additionalGuidelines) {
    prompt += `\n## Additional Guidelines\n${args.additionalGuidelines}\n`;
  }
  
  prompt += `\n## Remember\n- Your goal is to help students learn, not to solve problems for them\n- Guide them to discover solutions through questioning and hints\n- Encourage good debugging practices\n- Be patient and supportive throughout the process`;
  
  return prompt;
}

export function usePrompts() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPrompts([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'prompts'),
      where('createdBy', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const promptsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Prompt[];
      setPrompts(promptsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const createPrompt = async (data: Omit<Prompt, 'id' | 'generatedPrompt' | 'createdBy' | 'createdAt'>) => {
    if (!user) throw new Error('Must be logged in to create prompts');

    const generatedPrompt = generatePromptText(data);
    
    const docRef = await addDoc(collection(db, 'prompts'), {
      ...data,
      generatedPrompt,
      createdBy: user.uid,
      createdAt: new Date()
    });

    return docRef.id;
  };

  const updatePrompt = async (id: string, data: Omit<Prompt, 'id' | 'generatedPrompt' | 'createdBy' | 'createdAt'>) => {
    if (!user) throw new Error('Must be logged in');

    const generatedPrompt = generatePromptText(data);
    
    await updateDoc(doc(db, 'prompts', id), {
      ...data,
      generatedPrompt,
      updatedAt: new Date()
    });
  };

  const deletePrompt = async (id: string) => {
    if (!user) throw new Error('Must be logged in');
    await deleteDoc(doc(db, 'prompts', id));
  };

  const getPrompt = async (id: string): Promise<Prompt | null> => {
    if (!user) throw new Error('Must be logged in');

    const docRef = doc(db, 'prompts', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.createdBy === user.uid) {
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as Prompt;
      }
    }
    
    return null;
  };

  return {
    prompts,
    loading,
    createPrompt,
    updatePrompt,
    deletePrompt,
    getPrompt
  };
}

export function useTemplates() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'promptTemplates'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const templatesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PromptTemplate[];
      setTemplates(templatesData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const seedTemplates = async () => {
    // Check if templates already exist
    if (templates.length > 0) {
      return "Templates already exist";
    }

    const templatesData = [
      {
        name: "Python Programming Tutor",
        subject: "Python",
        description: "For helping students debug Python code and learn programming concepts",
        personaTemplate: "You are a friendly and encouraging Python programming tutor. Your goal is to help students debug their code by guiding them to the solution without giving it away.",
        goldenRuleTemplate: "Under no circumstances should you ever provide the corrected code or the direct solution. The student must write the final code themselves.",
        processStepsTemplate: [
          "Acknowledge their effort and validate their attempt",
          "Identify the general area where the bug might be located",
          "Ask guiding questions to help them think critically about their logic",
          "Suggest specific debugging techniques like print statements or step-through debugging",
          "Provide conceptual hints about Python features if needed",
          "Encourage them to test their understanding with small examples"
        ],
        isDefault: true,
      },
      {
        name: "JavaScript Debugging Assistant",
        subject: "JavaScript",
        description: "For helping students with JavaScript debugging and web development",
        personaTemplate: "You are a patient JavaScript mentor who helps students understand web development concepts and debug their code through guided discovery.",
        goldenRuleTemplate: "Never provide the complete solution or corrected code. Always guide the student to discover and implement the fix themselves.",
        processStepsTemplate: [
          "Acknowledge their progress and effort",
          "Point them toward the specific function or code block with the issue",
          "Ask questions about their expected vs actual results",
          "Suggest using browser developer tools or console.log for debugging",
          "Explain relevant JavaScript concepts without solving their specific problem",
          "Encourage testing with simplified examples"
        ],
        isDefault: true,
      },
      {
        name: "Math Problem Solving Guide",
        subject: "Mathematics",
        description: "For helping students work through math problems step by step",
        personaTemplate: "You are a supportive math tutor who helps students develop problem-solving skills by asking the right questions at the right time.",
        goldenRuleTemplate: "Never solve the problem for the student or provide the final answer. Guide them to work through each step themselves.",
        processStepsTemplate: [
          "Acknowledge their work and identify what they've done correctly",
          "Help them identify which step or concept they're struggling with",
          "Ask questions to help them recall relevant formulas or methods",
          "Suggest breaking the problem into smaller, manageable parts",
          "Guide them to check their work and verify their reasoning",
          "Encourage them to explain their thinking process"
        ],
        isDefault: true,
      },
      {
        name: "General Academic Tutor",
        subject: "General",
        description: "A flexible template for any subject area",
        personaTemplate: "You are a knowledgeable and patient tutor who specializes in helping students learn through guided discovery and critical thinking.",
        goldenRuleTemplate: "Your role is to guide learning, not to provide direct answers. Students must arrive at solutions through their own thinking and effort.",
        processStepsTemplate: [
          "Acknowledge their effort and current understanding",
          "Help them identify the specific area they need to focus on",
          "Ask probing questions to stimulate critical thinking",
          "Suggest resources or methods for finding information",
          "Guide them to make connections between concepts",
          "Encourage self-reflection on their learning process"
        ],
        isDefault: false,
      }
    ];

    for (const template of templatesData) {
      await addDoc(collection(db, 'promptTemplates'), template);
    }

    return "Templates seeded successfully";
  };

  return {
    templates,
    loading,
    seedTemplates
  };
}
