import { Message, Chat, Contact } from 'whatsapp-web.js';

export interface CommandContext {
  msg: Message;
  chat: Chat;
  contact: Contact;
  args: string[];
  reply: (text: string) => Promise<Message>;
}

export interface Command {
  name: string;
  description: string;
  run: (context: CommandContext) => Promise<void>;
}