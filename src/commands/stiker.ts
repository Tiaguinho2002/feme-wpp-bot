import { Command, CommandContext } from "../types/command.js";
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;

export const stiker: Command = {
  name: "!figurinha",
  description:
    "Transforma imagem em figurinha. Use respondendo uma mensagem com imagem",

  async run(ctx: CommandContext): Promise<void> {
    console.log("🎨 Comando !figurinha executado");

    if (!ctx.msg.hasQuotedMsg) {
      await ctx.reply(
        "❌ *Como usar:*\n\n" +
          "1. Responda uma mensagem que contenha uma imagem\n" +
          "2. Digite !figurinha\n\n" +
          "📌 *Exemplo:* Alguém envia uma foto → Você responde com !figurinha"
      );
      return;
    }

    console.log("✅ Mensagem tem quote");

    const quotedMsg = await ctx.msg.getQuotedMessage();

    if (!quotedMsg.hasMedia) {
      await ctx.reply("❌ A mensagem respondida não contém uma imagem!");
      return;
    }

    console.log("✅ Mensagem tem mídia");

    await ctx.chat.sendStateTyping();

    try {
      const media = await quotedMsg.downloadMedia();

      console.log("⬇️ Mídia baixada:", media.mimetype);

      if (!media.mimetype.startsWith("image/")) {
        await ctx.reply("❌ Isso não é uma imagem! Só aceito fotos 📷");
        await ctx.chat.clearState();
        return;
      }

      console.log("✅ É uma imagem! Criando figurinha...");

      // create sticker
      await ctx.msg.reply(media, undefined, {
        sendMediaAsSticker: true,
        stickerAuthor: "Bot do Tiaguinho 🤖",
        stickerName: "Figurinha Top",
      });

      console.log("🎉 Figurinha criada com sucesso!");

      await ctx.chat.clearState();
    } catch (error) {
      console.error("❌ Erro ao criar figurinha:", error);
      await ctx.reply(
        "Erro ao criar a figurinha 😔\n\n*Dica:* Certifique-se que a imagem não é muito grande!"
      );
      await ctx.chat.clearState();
    }
  },
};
