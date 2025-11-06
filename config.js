// Configuration File
// IMPORTANT: This file contains your API keys - never commit to GitHub!

const CONFIG = {
    // Groq API Configuration
    groq: {
        apiKey: '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',
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
