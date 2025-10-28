import { prompts } from "../prompts.js";
import { GeminiService } from "../services/GeminiService.js";
import { Command, CommandContext } from "../types/command.js";
import { GroupChat } from "whatsapp-web.js";
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;

const englishModeActive = new Map<string, boolean>();

export const englishMode: Command = {
  name: "!modo-ingles",
  description: "Ativa/desativa o modo inglês no chat",

  async run(ctx: CommandContext): Promise<void> {
    console.log("Comando !modo-ingles executado");

    try {
      const chatId = ctx.chat.id._serialized;
      
      const isActive = englishModeActive.get(chatId) || false;
      englishModeActive.set(chatId, !isActive);

      if (!isActive) {
        await ctx.chat.sendMessage(
          "✅ *Modo inglês ativado!*\n\n" +
          "Agora todas as suas mensagens serão processadas pelo assistente de inglês.\n" +
          "Use !modo-ingles novamente para desativar."
        );
      } else {
        await ctx.chat.sendMessage("❌ *Modo inglês desativado.*");
      }

    } catch (error) {
      console.error("Erro ao alternar o modo inglês:", error);
      await ctx.chat.sendMessage("❌ Erro ao ativar o modo inglês.");
    }
  },
};

export function isEnglishModeActive(chatId: string): boolean {
  return englishModeActive.get(chatId) || false;
}

export async function handleEnglishModeMessage(ctx: CommandContext): Promise<boolean> {
  const chatId = ctx.chat.id._serialized;
  
  if (!isEnglishModeActive(chatId)) {
    return false;
  }

  // Ignore messages from the bot itself
  if (ctx.msg.fromMe) {
    return false;
  }

  // Ignore commands
  if (ctx.msg.body.startsWith("!")) {
    return false;
  }

  try {
    console.log("Processando mensagem no modo inglês:", ctx.msg.body);

    const englishModePrompt = prompts.englishMode(ctx.msg.body);

    const geminiService = new GeminiService();
    const response = await geminiService.generateResponse(englishModePrompt);

    await ctx.msg.reply(response);

    return true; 
  } catch (error) {
    console.error("Erro ao processar mensagem no modo inglês:", error);
    await ctx.chat.sendMessage("❌ Erro ao processar sua mensagem.");
    return false;
  }
}

  