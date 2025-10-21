import { clientGemini } from "../services/gemini.js";
import { Command, CommandContext } from "../types/command.js";
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;

export const summarize: Command = {
  name: "!resumir",
  description:
    "Resume as últimas mensagens do chat. Use: !resumir [quantidade]",

  async run(ctx: CommandContext): Promise<void> {
    console.log("Comando !resumir executado");

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
      console.log(`Buscando ${quantidade} mensagens...`);

      const messages = await ctx.chat.fetchMessages({ limit: quantidade });

      console.log(`${messages.length} mensagens encontradas!`);

      const textos = messages
        .filter((msg) => msg.body && msg.body.trim().length > 0) // Só com texto
        .reverse() // Ordem cronológica (mais antiga → mais recente)
        .map((msg) => {
          const autor = msg.fromMe ? "Você" : msg.author || "Desconhecido";
          return `${autor}: ${msg.body}`;
        });

      if (textos.length === 0) {
        await ctx.reply("Não encontrei mensagens com texto para resumir!");
        await ctx.chat.clearState();
        return;
      }

      console.log(`${textos.length} mensagens com texto encontradas`);

      const conversaCompleta = textos.join("\n");

      const prompt = `Resuma a seguinte conversa de WhatsApp de forma clara e objetiva, destacando os pontos principais e decisões importantes, porém quero um resumo de verdade
      visando ter apenas no maximo 1400 caracteres para o resumo
      :\n\n${conversaCompleta}\n\nResumo:`;

      console.log("🤖 Enviando para IA...");

      const resumo = await clientGemini(prompt);
      console.log("Resumo gerado!");

      await ctx.reply(
        `*RESUMO DAS ÚLTIMAS ${textos.length} MENSAGENS: *\n\n` +
          `${resumo} \n\n` +
          `_Resumo gerado por IA do Tiaguinho_`
      );
      await ctx.chat.clearState();
    } catch (error) {
      console.error("Erro ao resumir", error);
      await ctx.reply("Erro ao gerar o resumo 😔");
      await ctx.chat.clearState();
    }
  },
};
