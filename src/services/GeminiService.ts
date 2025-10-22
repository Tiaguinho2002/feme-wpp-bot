import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({});
  }

  async generateResponse(prompt: string): Promise<string> {
    if (!prompt || prompt.trim().length === 0) {
      console.error("Prompt vazio ou inválido!");
      return "Desculpe, não recebi nenhuma pergunta válida.";
    }

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const text = response.text?.trim() || "";

      if (!text) {
        throw new Error("Resposta vazia da IA");
      }

      console.log(`📩 Mensagem recebida: "${text}"`);
      console.log(`📩 Tamanho: ${text.length} caracteres`);
      return text;
    } catch (error) {
      console.error("❌ [GEMINI] Erro:", error);
      return "Desculpe, ocorreu um erro ao processar sua solicitação.";
    }
  }
}
