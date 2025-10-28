import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import { help } from "./commands/help.js";
import { stiker } from "./commands/stiker.js";
import { summarize } from "./commands/summarize.js";
import { everyone } from "./commands/everyone.js";
import { whoIsRight } from "./commands/whoIsRight.js";
import {
  englishMode,
  handleEnglishModeMessage,
} from "./commands/englishMode.js";
import { Command, CommandContext } from "./types/command.js";

import dotenv from "dotenv";
import { GeminiService } from "./services/GeminiService.js";

dotenv.config();

const PREFIX = "!";

const commands = new Map<string, Command>([
  [help.name, help],
  [stiker.name, stiker],
  [summarize.name, summarize],
  [everyone.name, everyone],
  [whoIsRight.name, whoIsRight],
  [englishMode.name, englishMode],
]);

const client = new Client({
  authStrategy: new LocalAuth(),
});

let botNumber = "";

client.on("ready", () => {
  console.log("Client is ready!");
  botNumber = client.info.wid.user;
  console.log(`🤖 Bot number: ${botNumber}`);
});

client.on("message_create", async (msg) => {
  const text = msg.body || "";
  const chat = await msg.getChat();
  const contact = await msg.getContact();

  const ctx: CommandContext = {
    msg,
    chat,
    contact,
    args: text.split(/\s+/).slice(1), // empty initial arguments
    reply: (t) => msg.reply(t),
  };

  // Priority 1: Verify mentions
  if (text.includes("@") && chat.isGroup) {
    try {
      const mentions = await msg.getMentions();

      if (mentions && mentions.length > 0) {
        console.log(`✅ ${mentions.length} menção(ões) detectada(s)`);

        const botMentioned = mentions.some(
          (mention) => mention.id.user === botNumber
        );

        if (botMentioned) {
          console.log("🤖 Bot foi mencionado!");

          // Remove @
          const prompt = text.replace(/@\d+/g, "").trim();

          console.log(`📝 Prompt limpo: "${prompt}"`);

          if (!prompt || prompt.trim().length === 0) {
            await msg.reply("Você me mencionou mas não perguntou nada! 🤔");
            return;
          }

          await chat.sendStateTyping();

          try {
            const geminiService = new GeminiService();
            const aiResponse = await geminiService.generateResponse(prompt);
            console.log(`✅ Resposta da IA: "${aiResponse}"`);

            if (!aiResponse || aiResponse.trim().length === 0) {
              await msg.reply("A IA não conseguiu gerar uma resposta 😔");
            } else {
              await msg.reply(aiResponse);
            }

            await chat.clearState();
            return;
          } catch (error) {
            console.error("❌ Erro na IA:", error);
            await msg.reply("Desculpe, erro ao processar sua pergunta 😔");
            await chat.clearState();
            return;
          }
        }
      }
    } catch (error) {
      console.error("❌ Erro ao verificar menções:", error);
    }
  }

  // Priority 2
  const wasHandledByEnglishMode = await handleEnglishModeMessage(ctx);

  if (wasHandledByEnglishMode) {
    return;
  }

  // Priority 3:
  if (!text.startsWith(PREFIX)) {
    return;
  }

  const [cmdName, ...args] = text.split(/\s+/);
  console.log(`⚙️ Comando: ${cmdName}`);

  const cmd = commands.get(cmdName);
  if (!cmd) {
    await msg.reply("Comando não encontrado");
    return;
  }

  // Updates args in context
  ctx.args = args;

  try {
    await cmd.run(ctx);
  } catch (error) {
    console.error("❌ Erro ao executar comando:", error);
    await msg.reply("Erro ao executar o comando");
  }
});

client.initialize();
