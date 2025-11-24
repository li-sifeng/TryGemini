import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize client only if key exists (handled gracefully in UI if missing)
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `
你是一位专业的平面几何助教，专门负责讲解“蝴蝶定理”(Butterfly Theorem)。
你的目标是帮助学生直观地理解定理的几何意义和证明思路。

你的性格特点：
1. 亲切、耐心，像一位循循善诱的数学老师。
2. 解释时尽量结合几何直观，不要一上来就堆砌复杂的代数计算，除非用户要求。
3. 鼓励用户操作网页左侧的交互模型来观察规律。

关于蝴蝶定理：
- 核心：圆内一条弦PQ的中点M，过M任意作两条弦AB和CD。连接AD和BC，分别交PQ于X和Y。则M也是XY的中点（即XM=MY）。
- 提示：如果用户问证明方法，可以简要提及“射影几何”观点或“作垂线利用相似三角形/全等三角形”的初等几何证法。

请用中文回复，支持使用LaTeX格式的数学公式（用 $ 包裹，例如 $x^2+y^2=r^2$）。
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat | null => {
  if (!ai) return null;
  
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!ai) {
    return "请先配置 API Key 才能使用 AI 助教功能。";
  }

  try {
    const session = getChatSession();
    if (!session) throw new Error("Failed to initialize chat session");

    const response: GenerateContentResponse = await session.sendMessage({
      message: message
    });

    return response.text || "抱歉，我暂时无法回答这个问题。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 助教暂时掉线了，请稍后再试。";
  }
};