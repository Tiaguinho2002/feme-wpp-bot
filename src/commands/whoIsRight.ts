import { clientGemini } from "../services/gemini.js";
import { Command, CommandContext } from "../types/command.js";
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;


// usado LLM (Large Language Model) no prompt
export const whoIsRight: Command = {
  name: "!quem-ta-certo",
  description:
    "Feme pega as informações e opina quem está correto na discussão.",

  async run(ctx: CommandContext): Promise<void> {
    console.log("Comando !quem-está-certo está rodando");

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
    console.log(`Buscando ${quantidade} mensagens...`)

    const messages = await ctx.chat.fetchMessages({ limit: quantidade });
    console.log(`${messages.length} messagens encontradas!`);

    const textos = messages
    .filter((msg) => msg.body && msg.body.trim().length > 0)
    .reverse()
    .map((msg) => {
        const autor = msg.fromMe ? "Você" : msg.author || "Desconhecido";
        return `${autor}: ${msg.body}`;
    });

    if (textos.length === 0) {
       await ctx.reply("Não encontrei mensagens");
       await ctx.chat.clearState();
       return; 
    }

    console.log(`${textos.length} mensagens com texto encontradas`)

    const conversaCompleta = textos.join("\n");

    const prompt = `
    Pegue as ultimas mensagens da conversa de WhatsApp de forma clara e objetiva, pense profundamente em todas
    as opiniões que foram dadas, mencione os integrantes com o nome caso apareçao ou de alguma forma, e com base no seu conhecimento também, nos diga quem está mais correto no grupo e porque.
    Faça isso de forma que seja breve e não ultrapasse 600 caracteres para o resumo, e fale de todas as opiniões quem está mais correto dentre o grupo.
    \n\n${conversaCompleta}\n\nResumo:
    `;

   console.log("🤖 Enviando para IA...");

   const resumo = await clientGemini(prompt);
   console.log("Resumo da discussão gerado!")

    await ctx.reply(
    `*Resumo de quem está certo baseado nas últimas ${textos.length} mensagens:*\n\n` +
    `${resumo} \n\n` +
    `_Resumo gerado por Feme bot_ `
    )

   } catch (error) {
    console.error("Erro ao responder", error)
    await ctx.reply("Erro ao responder 😔")
    await ctx.chat.clearState();
   }
  },
};
