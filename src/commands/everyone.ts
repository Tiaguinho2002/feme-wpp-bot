import { Command, CommandContext } from "../types/command.js";
import { GroupChat } from "whatsapp-web.js";
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;

export const everyone: Command = {
  name: "!todos",
  description: "Comando para marcar todos os integrantes do grupo",

  async run(ctx: CommandContext): Promise<void> {
    console.log("Comando !Todos funcionando!");

    async function listMembers(chat: GroupChat | any) {
      const numeroExcluir = "5511954045475";

      let text = `Atenção membros do ${chat.name}!\n`;
      let mentions = [];

      const participantesFiltrados = chat.participants.filter(
        (participant: any) => participant.id.user !== numeroExcluir
      );

      for (let participant of participantesFiltrados) {
        mentions.push(`${participant.id.user}@c.us`);
        text += `@${participant.id.user} `;
      }

      await chat.sendMessage(text, { mentions });
    }

    await listMembers(ctx.chat);
  },
};
