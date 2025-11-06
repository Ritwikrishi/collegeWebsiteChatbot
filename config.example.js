// Configuration Example
// Copy this file to config.js and add your API keys
// IMPORTANT: Never commit config.js to GitHub!

const CONFIG = {
    // Groq API Configuration
    groq: {
        apiKey: 'YOUR_GROQ_API_KEY_HERE', // Get free key from https://console.groq.com
        model: 'llama-3.1-8b-instant',
        endpoint: 'https://api.groq.com/openai/v1/chat/completions'
    },

    // Ollama Configuration (for local deployment)
    ollama: {
        endpoint: 'http://localhost:11434/api/generate',
        model: 'phi3:mini'
    },

    // Default API mode: 'groq', 'ollama', or 'rule-based'
    apiMode: 'groq'
};
