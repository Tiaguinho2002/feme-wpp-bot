import { Command, CommandContext } from "../types/command.js";

export const help: Command = {
  name: "!help",
  description: "Mostra a lista de comandos disponíveis",
  async run(ctx: CommandContext): Promise<void> {
    const helpMessage = `
*🌟 Lista de Comandos do Bot 🌟*

🤖 *!help*
  - Mostra esta lista de comandos.

🖼️ *!figurinha*
  - Transforma uma imagem em figurinha.
  - _Modo de uso:_ Responda a uma mensagem com imagem ou anexe a imagem na mesma mensagem do comando.

🎙️ *!resumir*
  -  Resume as últimas mensagens do chat. Use: !resumir [quantidade].
  - _Modo de uso:_ Lance !resumir + o numero de mensagens que deseja do resumo.

👩‍👩‍👧‍👦*!todos*
  - Marca todos os membros do grupo para assuntos importantes.
  -_Modo de uso:_ Lance !todos para realizar a marcação.

✅*quem-ta-certo*
  - Pega o conteúdo dos assuntos falados e da a opinião sobre quem está certo!
  -_Modo de uso:_ Lance !quem-ta-certo para realizar a análise da Feme sobre seus debates.
---

🇺🇸*!modo-ingles*
  - Ativa ou desativa o modo inglês no chat.
  - _Modo de uso:_ Lance !modo-ingles para alternar o modo inglês.
  - Quando ativado, todas as suas mensagens serão processadas pelo assistente de inglês.
  - Obs: ideal para usar em chats de estudo de inglês junto a ele.

💡 *Dica:* Para falar com a IA (Gemini), basta *mencionar* o bot na sua mensagem!
    `.trim();

    await ctx.reply(helpMessage);
  },
};
