import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({});

export default async function ClientGemini(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text;
}

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("ready", () => {
  console.log("Client is ready!");
});

// integrar IA - OK!
client.on("message_create", async (message) => {
  const geminiPrefix = "!feme";

  if (message.body === "!ping") {
    client.sendMessage(message.from, "pong");
    return;
  }

  if (message.body.startsWith(geminiPrefix)) {
    const chat = await message.getChat();
    chat.sendStateTyping(); // Mostra que o bot está digitando

    // Pega a pergunta removendo o prefixo
    const prompt = message.body.substring(geminiPrefix.length).trim();

    if (prompt.length === 0) {
      message.reply("Por favor, digite sua pergunta após o prefixo `!feme `.");
      chat.clearState();
      return;
    }

    try {
      const aiResponse = await ClientGemini(prompt);
      message.reply(aiResponse);
    } catch (error) {
      console.error("Erro na comunicação com a IA:", error);
      message.reply(
        "Desculpe, a IA falhou ao responder. Tente novamente mais tarde."
      );
    }
    chat.clearState();
  }
});

// teste da menção - OK!
client.on("message", async (msg) => {
  const mentions = await msg.getMentions();

  for (let user of mentions) {
    console.log(`${user.pushname} was mentioned`);
    const prompt = msg.body;

    if (prompt.length === 0 || "") {
      message.reply("escreve algo ai amigão, ta de brincadeira?");
      chat.clearState();
      return;
    }

    const chat = await msg.getChat();
    chat.sendStateTyping();

    const aiResponse = await ClientGemini(prompt);
    msg.reply(aiResponse);

    chat.clearState();
  }
});

let figurinhaGerada = false;
// Evento para imagens virarem sticker

client.on("message", async (stik) => {
  const mentions = await stik.getMentions();

  for (let user of mentions) {
    console.log(`${user.pushname} foi mencionado`);

    if (stik.fromMe || figurinhaGerada) return;

    if (stik.hasMedia) {
      figurinhaGerada = true;
      const media = await stik.downloadMedia();

      await client.sendMessage(stik.from, media, {
        sendMediaAsSticker: true,
        stickerAuthor: "Bot do Tiaguinho",
        stickerName: "test-sticker",
      });

      console.log("Imagem recebida e enviado como figurinha");

      setTimeout(() => {
        figurinhaGerada = false;
      }, 3000); // Reseta a variável após 3 segundos
    }
  }
});

client.on("message", async (msg) => {
  console.log(msg.body);
  if (msg.fromMe || figurinhaGerada) return;

  if (msg.hasMedia) {
    figurinhaGerada = true;
    const media = await msg.downloadMedia();

    await client.sendMessage(msg.from, media, {
      sendMediaAsSticker: true,
      stickerAuthor: "Bot do Tiaguinho",
      stickerName: "test-sticker",
    });

    console.log("Imagem recebida e enviado como figurinha");

    setTimeout(() => {
      figurinhaGerada = false;
    }, 3000); // Reseta a variável após 3 segundos
  }
});

client.initialize();

function formatPhoneNumber(number) {
  if (number.includes("@c.us") || number.includes("@g.us")) {
    return number;
  }
  return `${number.replace(/[^0-9]/g, "")}@c.us`;
}
