import { Command, CommandContext } from "../types/command.js";
import { GeminiService } from "../services/GeminiService.js";
import { prompts } from "../prompts.js";
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;

export const summarize: Command = {
  name: "!resumir",
  description:
    "Resume as últimas mensagens do chat. Use: !resumir [quantidade]",

  async run(ctx: CommandContext): Promise<void> {
    console.log("📢 Comando !resumir executado");

    const quantidade = parseInt(ctx.args[0]) || 10;

    if (quantidade < 5 || quantidade > 100) {
      await ctx.reply(
        "❌ *Quantidade inválida!*\n\n" +
          "📌 Use entre 5 e 100 mensagens\n" +
          "💡 Exemplo: !resumir 20"
      );
      return;
    }

    await ctx.chat.sendStateTyping();

    try {
      console.log(`🔍 Buscando ${quantidade} mensagens...`);

      const messages = await ctx.chat.fetchMessages({ limit: quantidade });

      console.log(`✅ ${messages.length} mensagens encontradas!`);

      const textos: string[] = [];
      const mentionContacts: any[] = [];

      // Browse the messages in chronological order.
      for (const msg of messages.reverse()) {
        if (!msg.body || msg.body.trim().length === 0) continue;

        const contact = await msg.getContact();
        let nomeAutor: string;

        if (msg.fromMe) {
          nomeAutor = "Você";
        } else {
          nomeAutor =
            contact.pushname ||
            contact.name ||
            contact.number ||
            "Desconhecido";
        }

        textos.push(`${nomeAutor}: ${msg.body}`);

        // It adds to the mentions if it's not the bot itself.
        if (!msg.fromMe) mentionContacts.push(contact);
      }

      if (textos.length === 0) {
        await ctx.reply("Não encontrei mensagens com texto para resumir!");
        await ctx.chat.clearState();
        return;
      }

      console.log(` ${textos.length} mensagens com texto válidas`);

      const conversaCompleta = textos.join("\n");
      const prompt = prompts.summarize(conversaCompleta);

      console.log("🤖 Enviando conversa para o Gemini...");

      const geminiService = new GeminiService();
      const resumo = await geminiService.generateResponse(prompt);

      console.log("✅ Resumo gerado com sucesso!");

      await ctx.chat.sendMessage(
        `*📝 RESUMO DAS ÚLTIMAS ${textos.length} MENSAGENS:*\n\n${resumo}\n\n_Resumo gerado por Feme bot_`,
        { mentions: mentionContacts }
      );

      await ctx.chat.clearState();
    } catch (error) {
      console.error("❌ Erro ao resumir:", error);
      await ctx.reply("⚠️ Ocorreu um erro ao gerar o resumo 😔");
      await ctx.chat.clearState();
    }
  },
};
