const axios = require('axios');
const logger = require('../logger');
const { OpenAI } = require("openai");
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});
module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // Check if the bot has been mentioned
    if (!message.mentions.has(CLIENT_ID)) return;

    // Start typing to indicate the bot is working on a response
    await message.channel.sendTyping();
    const stream = await client.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: message.content }],
      stream: true,
    });
    sentMessage = await message.channel.send("...");
    let text = ""
    let count = 0
    for await (const chunk of stream) {
      count += 1
      text = text.concat(chunk.choices[0]?.delta?.content || "")
      if (!text || count % 15 != 0) continue;
      await sentMessage.edit(text);
    }
    await sentMessage.edit(text)
  }
}

