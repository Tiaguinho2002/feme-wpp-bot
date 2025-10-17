import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import { help } from "./commands/help.js";
import { Command, CommandContext } from "./types/command.js";
import { clientGemini } from "./services/gemini.js";

const PREFIX = "!";

const commands = new Map<string, Command>([[help.name, help]]);

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message_create", async (msg) => {
  const text = msg.body || "";
  if (!text.startsWith(PREFIX)) {
    return;
  }

  const [cmdName, ...args] = text.split(/\s+/);
  console.log(cmdName);
  
  const chat = await msg.getChat();
  const contact = await msg.getContact();

  const cmd = commands.get(cmdName);
  if (!cmd) {
    await msg.reply("Comando não encontrado");
    return;
  }

  const ctx: CommandContext = { 
    msg, 
    chat, 
    contact, 
    args, 
    reply: (t) => msg.reply(t) 
  };

  try {
    await cmd.run(ctx);
  } catch (error) {
    console.error("deu ruim", error);
    await msg.reply("erro ao executar o cmd");
  }
});

client.initialize();