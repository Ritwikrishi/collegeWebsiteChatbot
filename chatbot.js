// Chatbot Widget Implementation
class CollegeChatbot {
    constructor() {
        this.isOpen = false;
        this.conversationHistory = [];
        this.isProcessing = false; // Prevent multiple simultaneous requests

        // Load configuration from config.js
        if (typeof CONFIG !== 'undefined') {
            this.apiMode = CONFIG.apiMode || 'rule-based';
            this.groqEndpoint = CONFIG.groq?.endpoint || 'https://api.groq.com/openai/v1/chat/completions';
            this.groqApiKey = CONFIG.groq?.apiKey || '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';
            this.groqModel = CONFIG.groq?.model || 'llama-3.1-8b-instant';
            this.ollamaEndpoint = CONFIG.ollama?.endpoint || 'http://localhost:11434/api/generate';
            this.ollamaModel = CONFIG.ollama?.model || 'phi3:mini';
        } else {
            // Fallback to rule-based if no config
            console.warn('⚠️ config.js not found. Using rule-based mode. Copy config.example.js to config.js and add your API key.');
            this.apiMode = 'rule-based';
            this.groqEndpoint = 'https://api.groq.com/openai/v1/chat/completions';
            this.groqApiKey = '';
            this.groqModel = 'llama-3.1-8b-instant';
            this.ollamaEndpoint = 'http://localhost:11434/api/generate';
            this.ollamaModel = 'phi3:mini';
        }

        this.init();
    }

    init() {
        this.createChatbotUI();
        this.attachEventListeners();
        this.sendWelcomeMessage();
    }

    createChatbotUI() {
        // Create chatbot container
        const container = document.createElement('div');
        container.className = 'chatbot-container';
        container.innerHTML = `
            <button class="chatbot-button" id="chatbot-toggle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l5.71-.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.35 0-2.63-.28-3.8-.78l-.27-.15-2.86.49.49-2.86-.15-.27C4.28 14.63 4 13.35 4 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8z"/>
                    <circle cx="9" cy="12" r="1"/>
                    <circle cx="12" cy="12" r="1"/>
                    <circle cx="15" cy="12" r="1"/>
                </svg>
            </button>
            
            <div class="chatbot-window" id="chatbot-window">
                <div class="chatbot-header">
                    <h3>SXC Assistant</h3>
                    <button class="chatbot-close" id="chatbot-close">&times;</button>
                </div>
                <div class="chatbot-messages" id="chatbot-messages"></div>
                <div class="chatbot-input-area">
                    <input 
                        type="text" 
                        class="chatbot-input" 
                        id="chatbot-input" 
                        placeholder="Ask me anything..."
                        autocomplete="off"
                    />
                    <button class="chatbot-send" id="chatbot-send">Send</button>
                </div>
            </div>
        `;
        document.body.appendChild(container);
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('chatbot-toggle');
        const closeBtn = document.getElementById('chatbot-close');
        const sendBtn = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');

        toggleBtn.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('chatbot-window');
        window.classList.toggle('open');

        if (this.isOpen) {
            document.getElementById('chatbot-input').focus();
        }
    }

    sendWelcomeMessage() {
        setTimeout(() => {
            this.addBotMessage("Hello! 👋 I'm the St. Xavier's College virtual assistant. I can help you with information about courses, admissions, facilities, and more. How can I assist you today?");
        }, 500);
    }

    async sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();

        // Prevent empty messages or if already processing
        if (!message || this.isProcessing) return;

        // Set processing flag
        this.isProcessing = true;

        // Add user message to UI only (don't add to history yet)
        this.addUserMessage(message);

        // Clear input immediately
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Process message and respond based on API mode
        if (this.apiMode === 'ollama') {
            await this.processMessageWithOllama(message);
        } else if (this.apiMode === 'groq') {
            await this.processMessageWithGroq(message);
        } else {
            // Add user message to history for rule-based mode
            this.conversationHistory.push({ role: 'user', content: message });

            setTimeout(() => {
                this.hideTypingIndicator();
                const response = this.processMessage(message);
                this.addBotMessage(response);
                this.conversationHistory.push({ role: 'assistant', content: response });
                this.isProcessing = false; // Reset processing flag
            }, 1000 + Math.random() * 1000); // Random delay for natural feel
        }
    }

    async processMessageWithGroq(message) {
        try {
            console.log('🚀 Calling Groq API with streaming...');

            // Add user message to conversation history
            this.conversationHistory.push({ role: 'user', content: message });

            // Build system prompt
            const systemPrompt = this.buildSystemPrompt();

            // Build messages array for chat API
            const messages = [
                { role: 'system', content: systemPrompt }
            ];

            // Add conversation history (last 6 messages including current one)
            const recentHistory = this.conversationHistory.slice(-7); // Get last 7 to include system + 6 messages
            for (const msg of recentHistory) {
                messages.push({ role: msg.role, content: msg.content });
            }

            // Hide typing indicator and create message container for streaming
            this.hideTypingIndicator();
            this.createStreamingMessage();

            // Call Groq API with streaming
            const response = await fetch(this.groqEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.groqApiKey}`
                },
                body: JSON.stringify({
                    model: this.groqModel,
                    messages: messages,
                    stream: true,
                    max_tokens: 300,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Groq API error ${response.status}: ${errorText}`);
            }

            // Read the streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Decode the chunk and add to buffer
                buffer += decoder.decode(value, { stream: true });

                // Split by data: prefix for Server-Sent Events
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.trim() || line.trim() === 'data: [DONE]') continue;

                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.substring(6));
                            const content = data.choices?.[0]?.delta?.content;
                            if (content) {
                                fullResponse += content;
                                this.updateStreamingMessage(fullResponse);
                            }
                        } catch (e) {
                            console.warn('Failed to parse SSE chunk:', line);
                        }
                    }
                }
            }

            console.log('✅ Groq streaming complete');

            if (!fullResponse.trim()) {
                throw new Error('Empty response from Groq');
            }

            // Remove cursor after streaming is done
            const contentDiv = document.getElementById('streaming-content');
            if (contentDiv) {
                const formattedMessage = fullResponse.trim().replace(/\n/g, '<br>');
                contentDiv.innerHTML = formattedMessage;
                // Remove the content ID so next message doesn't update this one
                contentDiv.removeAttribute('id');
            }

            // Remove the streaming message ID
            const streamingMsg = document.getElementById('streaming-message');
            if (streamingMsg) {
                streamingMsg.removeAttribute('id');
            }

            // Store in conversation history
            this.conversationHistory.push({ role: 'assistant', content: fullResponse.trim() });

            // Reset processing flag
            this.isProcessing = false;

        } catch (error) {
            console.error('❌ Groq API error:', error);
            this.isProcessing = false; // Reset on error too
            this.hideTypingIndicator();

            // Remove any partial streaming message
            const streamingMsg = document.getElementById('streaming-message');
            if (streamingMsg) {
                streamingMsg.remove();
            }

            // Fallback to rule-based response
            const fallbackResponse = this.processMessage(message);

            let errorMsg = '';
            if (error.message.includes('401')) {
                errorMsg = '\n\n⚠️ Invalid Groq API key. Please set your API key in chatbot.js. Using fallback mode.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMsg = '\n\n⚠️ Cannot connect to Groq API. Check your internet connection. Using fallback mode.';
            } else {
                errorMsg = `\n\n⚠️ ${error.message}. Using fallback mode.`;
            }

            this.addBotMessage(fallbackResponse + errorMsg);
            this.conversationHistory.push({ role: 'assistant', content: fallbackResponse });
        }
    }

    async processMessageWithOllama(message) {
        try {
            console.log('🤖 Calling Ollama API with streaming...');

            // Add user message to conversation history first
            this.conversationHistory.push({ role: 'user', content: message });

            // Build context with knowledge base information
            const systemPrompt = this.buildSystemPrompt();

            // Build conversation context (will include the message we just added)
            const conversationContext = this.buildConversationContext();

            // Create the full prompt
            const fullPrompt = `${systemPrompt}\n\n${conversationContext}\n\nAssistant:`;

            console.log('📝 Prompt length:', fullPrompt.length, 'characters');

            // Hide typing indicator and create message container for streaming
            this.hideTypingIndicator();
            this.createStreamingMessage();

            // Call Ollama API with streaming
            const response = await fetch(this.ollamaEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.ollamaModel,
                    prompt: fullPrompt,
                    stream: true, // Enable streaming
                    options: {
                        temperature: 0.7,
                        top_p: 0.9,
                        num_predict: 200,
                        num_ctx: 2048,
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ollama API error ${response.status}: ${errorText}`);
            }

            // Read the streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                // Decode the chunk and add to buffer
                buffer += decoder.decode(value, { stream: true });

                // Split by newlines to get complete JSON objects
                const lines = buffer.split('\n');

                // Keep the last incomplete line in the buffer
                buffer = lines.pop() || '';

                // Process complete lines
                for (const line of lines) {
                    if (!line.trim()) continue;

                    try {
                        const data = JSON.parse(line);
                        if (data.response) {
                            fullResponse += data.response;
                            // Update immediately for each token
                            this.updateStreamingMessage(fullResponse);
                        }
                    } catch (e) {
                        console.warn('Failed to parse chunk:', line);
                    }
                }
            }

            // Process any remaining buffer
            if (buffer.trim()) {
                try {
                    const data = JSON.parse(buffer);
                    if (data.response) {
                        fullResponse += data.response;
                        this.updateStreamingMessage(fullResponse);
                    }
                } catch (e) {
                    // Ignore
                }
            }

            console.log('✅ Streaming complete');

            if (!fullResponse.trim()) {
                throw new Error('Empty response from Ollama');
            }

            // Remove cursor after streaming is done
            const contentDiv = document.getElementById('streaming-content');
            if (contentDiv) {
                const formattedMessage = fullResponse.trim().replace(/\n/g, '<br>');
                contentDiv.innerHTML = formattedMessage;
                // Remove the content ID so next message doesn't update this one
                contentDiv.removeAttribute('id');
            }

            // Remove the streaming message ID so it becomes a regular message
            const streamingMsg = document.getElementById('streaming-message');
            if (streamingMsg) {
                streamingMsg.removeAttribute('id');
            }

            // Store in conversation history
            this.conversationHistory.push({ role: 'assistant', content: fullResponse.trim() });

            // Reset processing flag
            this.isProcessing = false;

        } catch (error) {
            console.error('❌ Ollama API error:', error);
            this.isProcessing = false; // Reset on error too
            this.hideTypingIndicator();

            // Remove any partial streaming message
            const streamingMsg = document.getElementById('streaming-message');
            if (streamingMsg) {
                streamingMsg.remove();
            }

            // Fallback to rule-based response
            const fallbackResponse = this.processMessage(message);

            let errorMsg = '';
            if (error.name === 'AbortError') {
                errorMsg = '\n\n⚠️ Ollama response timed out. Using fallback mode.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMsg = '\n\n⚠️ Cannot connect to Ollama. Make sure Ollama is running (ollama serve). Using fallback mode.';
            } else {
                errorMsg = `\n\n⚠️ ${error.message}. Using fallback mode.`;
            }

            this.addBotMessage(fallbackResponse + errorMsg);
            this.conversationHistory.push({ role: 'assistant', content: fallbackResponse });
        }
    }

    createStreamingMessage() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message message-bot';
        messageDiv.id = 'streaming-message';
        messageDiv.setAttribute('data-timestamp', Date.now());
        messageDiv.innerHTML = `<div class="message-content" id="streaming-content"><span class="cursor">▊</span></div>`;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        return 'streaming-message';
    }

    updateStreamingMessage(content) {
        const contentDiv = document.getElementById('streaming-content');
        if (contentDiv) {
            const formattedMessage = content.replace(/\n/g, '<br>');
            contentDiv.innerHTML = formattedMessage + '<span class="cursor">▊</span>';
            this.scrollToBottom();
        }
    }

    buildSystemPrompt() {
        const kb = knowledgeBase;
        return `You are St. Xavier's College virtual assistant. Be helpful and concise.

College: ${kb.college.name}, Est. ${kb.college.established}, ${kb.college.affiliation}
Location: ${kb.college.location}
Contact: ${kb.college.phone}, ${kb.college.email}

Courses: B.A. English, B.Sc. CS, B.Com, B.A. Economics, B.Sc. Math, B.A. Psychology

Admissions 2025-26: Apply May 15-Jun 30, Classes start Aug 1

Facilities: Library (100k+ books), Computer Labs, Sports, Auditorium, Cafeteria, Transport

Stats: 5000+ students, 200+ faculty, 95% placement

Keep responses brief, friendly, and accurate. Direct users to contact for details not provided.`;
    }

    buildConversationContext() {
        // Get last few messages for context (limit to prevent token overflow)
        const recentHistory = this.conversationHistory.slice(-6);

        let context = '';
        for (const msg of recentHistory) {
            if (msg.role === 'user') {
                context += `Human: ${msg.content}\n`;
            } else if (msg.role === 'assistant') {
                context += `Assistant: ${msg.content}\n`;
            }
        }

        return context;
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();

        // Check for specific course inquiries
        const courseNames = knowledgeBase.courses.map(c => c.name.toLowerCase());
        for (let i = 0; i < courseNames.length; i++) {
            if (lowerMessage.includes(courseNames[i]) ||
                lowerMessage.includes(knowledgeBase.courses[i].name.toLowerCase().split('(')[0].trim())) {
                const course = knowledgeBase.courses[i];
                return `📚 ${course.name}\n\n⏱️ Duration: ${course.duration}\n🪑 Seats: ${course.seats}\n✅ Eligibility: ${course.eligibility}\n\n${course.description}\n\nWould you like to know more about admissions or other courses?`;
            }
        }

        // Check FAQ patterns
        for (const [category, data] of Object.entries(knowledgeBase.faqPatterns)) {
            const keywords = data.keywords;
            const hasKeyword = keywords.some(keyword => lowerMessage.includes(keyword));

            if (hasKeyword) {
                if (data.responses) {
                    // Return random response from array
                    return data.responses[Math.floor(Math.random() * data.responses.length)];
                } else if (data.response) {
                    return data.response;
                }
            }
        }

        // Check for specific facility queries
        for (const facility of knowledgeBase.facilities) {
            if (lowerMessage.includes(facility.name.toLowerCase())) {
                return `${facility.name}: ${facility.description}\n\nWould you like to know about other facilities?`;
            }
        }

        // Check for numbers/statistics
        if (lowerMessage.includes('student') && lowerMessage.includes('how many')) {
            return `We have ${knowledgeBase.stats.students} students enrolled across various undergraduate programs.`;
        }

        if (lowerMessage.includes('faculty') && (lowerMessage.includes('how many') || lowerMessage.includes('teacher'))) {
            return `Our college has ${knowledgeBase.stats.faculty} experienced faculty members dedicated to quality education.`;
        }

        // Context-aware responses based on conversation history
        if (this.conversationHistory.length > 2) {
            const lastBotMessage = this.conversationHistory[this.conversationHistory.length - 1].content.toLowerCase();

            // If last message was about courses and user says yes/more
            if (lastBotMessage.includes('course') && (lowerMessage.includes('yes') || lowerMessage.includes('more'))) {
                return knowledgeBase.faqPatterns.courses.response;
            }

            // If last message was about admissions and user says eligibility
            if (lastBotMessage.includes('admission') && (lowerMessage.includes('eligibility') || lowerMessage.includes('criteria'))) {
                return knowledgeBase.faqPatterns.eligibility.response;
            }
        }

        // Check for yes/no responses
        if (lowerMessage === 'yes' || lowerMessage === 'yeah' || lowerMessage === 'sure') {
            return "Great! What specific information would you like to know? I can help with courses, admissions, facilities, placements, or contact details.";
        }

        if (lowerMessage === 'no' || lowerMessage === 'nope') {
            return "No problem! Is there anything else I can help you with?";
        }

        // Default response for unrecognized queries
        return this.getDefaultResponse(lowerMessage);
    }

    getDefaultResponse(message) {
        const suggestions = [
            "I'm not sure about that specific question. Here are some topics I can help with:\n\n• Courses and Programs\n• Admissions Process\n• Fees Structure\n• Facilities\n• Placements\n• Contact Information\n\nWhat would you like to know?",
            "I don't have specific information about that. However, I can help you with:\n\n• Course details and eligibility\n• Admission dates and process\n• College facilities\n• Placement statistics\n• Contact details\n\nHow can I assist you?",
            "That's a great question! While I don't have that exact information, I can help you with courses, admissions, facilities, and more. You can also contact our office directly:\n\n📞 +91-11-2397-XXXX\n📧 info@stxaviers.edu.in\n\nWhat else would you like to know?"
        ];

        return suggestions[Math.floor(Math.random() * suggestions.length)];
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message message-user';
        messageDiv.setAttribute('data-timestamp', Date.now());
        messageDiv.innerHTML = `<div class="message-content">${this.escapeHtml(message)}</div>`;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message message-bot';

        // Format message with line breaks
        const formattedMessage = message.replace(/\n/g, '<br>');
        messageDiv.innerHTML = `<div class="message-content">${formattedMessage}</div>`;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message message-bot typing-indicator-container';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CollegeChatbot();
    });
} else {
    new CollegeChatbot();
}
