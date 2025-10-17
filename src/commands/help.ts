import { Command, CommandContext } from '../types/command.js';

export const help: Command = {
  name: "!help",
  description: "Mostra a lista de comandos disponíveis",
  async run(ctx: CommandContext): Promise<void> {
    await ctx.reply("Atualmente sem comandos campeão");
  }
};