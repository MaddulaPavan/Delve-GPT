const TelegramBot = require('node-telegram-bot-api');
const OpenAI = require('openai');

// Initialize Telegram bot
const token = 'YOUR TELEGRAM BOT KEY';
const bot = new TelegramBot(token, { polling: true });

// Initialize OpenAI client with your API key
const openai = new OpenAI({ apiKey: 'YOUR OPEN AI API key' });

async function handleMessage(msg) {
    try {
        const chatId = msg.chat.id;
        const userMessage = msg.text;

        // Check if user asked for the bot's name
        if (userMessage.toLowerCase().includes(' your name')) {
            bot.sendMessage(chatId, 'My name is DelveGPT.');
            return;
        }

        // Get response from DelveGPT
        const delveGPTResponse = await getDelveGPTResponse(userMessage);

        // Send DelveGPT response back to the chat
        bot.sendMessage(chatId, delveGPTResponse);
    } catch (error) {
        console.error('Error handling message:', error);
        // Send a generic error message
        bot.sendMessage(msg.chat.id, 'Sorry, I encountered an error while processing your request.');
    }
}

// Function to get response from DelveGPT
async function getDelveGPTResponse(message) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant designed to output text." },
                { role: "user", content: message }
            ],
            model: "gpt-3.5-turbo-0125",
            response_format: { type: "text" } // Output in text format
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error fetching DelveGPT response:', error);
        throw new Error('Failed to fetch response from DelveGPT');
    }
}

// Event listener for incoming messages
bot.on('message', handleMessage);

// Log bot startup
console.log('DelveGPT started.');
