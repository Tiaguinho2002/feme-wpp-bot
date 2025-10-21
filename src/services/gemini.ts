import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({});

// LLMs para parte do fullPrompt
export async function clientGemini(prompt: string): Promise<string> {
  if (!prompt || prompt.trim().length === 0) {
    console.error("Prompt vazio ou inválido!");
    return "Desculpe, não recebi nenhuma pergunta válida.";
  }
  try {
    const fullPrompt = `Você é o Feme 🤖, um assistente virtual do WhatsApp amigável e divertido.
Fale de forma natural e simpática, usando emojis às vezes 😊.
Dê respostas curtas e agradáveis.
Evite linguagem muito formal e se mandarem algo depravado ou informal pode responder do mesmo jeito, não precisa ter escrúpulos. 

Usuário: ${prompt}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    });

    const text = response.text?.trim() || "";

    if (text.length === 0) {
      console.warn(
        "⚠️ [GEMINI] Resposta da IA vazia, mas a chamada foi bem-sucedida."
      );
      return "A IA não conseguiu gerar uma resposta para sua solicitação.";
    }
    console.log(`📩 Mensagem recebida: "${text}"`);
    console.log(`📩 Tamanho: ${text.length} caracteres`);
    return text;
  } catch (error) {
    console.error("❌ [GEMINI] Erro ao comunicar com a IA:", error);

    return "Ocorreu um erro interno ao processar sua solicitação.";
  }
}


