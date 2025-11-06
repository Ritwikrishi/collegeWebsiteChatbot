<<<<<<< HEAD
# College Website Chatbot 🤖

An AI-powered chatbot for college websites with streaming responses and multiple API integrations.

![Chatbot Demo](https://img.shields.io/badge/Status-Live-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- 🚀 **Real-time Streaming Responses** - ChatGPT-like word-by-word text generation
- 🔄 **Multiple AI Backends** - Groq API, Ollama, or rule-based fallback
- 💬 **Smart Conversations** - Maintains context across messages
- 📚 **Knowledge Base** - Pre-configured college information
- 🎨 **Modern UI** - Responsive design with smooth animations and light blue theme
- 🔐 **Secure** - API keys kept separate from codebase

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/collegeWebsiteChatbot.git
cd collegeWebsiteChatbot
```

### 2. Configure API Keys

```bash
# Copy the example config file
cp config.example.js config.js

# Edit config.js and add your Groq API key
# Get a free key from https://console.groq.com
```

Edit `config.js`:
```javascript
const CONFIG = {
    groq: {
        apiKey: 'YOUR_GROQ_API_KEY_HERE', // Add your key here
        model: 'llama-3.1-8b-instant',
        endpoint: 'https://api.groq.com/openai/v1/chat/completions'
    },
    apiMode: 'groq'
};
```

### 3. Run Locally

```bash
# Start a local server (Python 3)
python -m http.server 8000

# Or use Node.js
npx http-server -p 8000
```

Visit: `http://localhost:8000/college-website.html`

## 🌐 Deploy to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `collegeWebsiteChatbot` (or any name you prefer)
3. **Don't** add README, .gitignore, or license (we already have them)

### Step 2: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: College chatbot with AI integration"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/collegeWebsiteChatbot.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **main** branch
4. Click **Save**
5. Wait 1-2 minutes for deployment

Your site will be live at: `https://YOUR_USERNAME.github.io/collegeWebsiteChatbot/college-website.html`

### Step 4: API Key for Live Site

**⚠️ IMPORTANT:** The chatbot will run in **rule-based mode** on GitHub Pages by default (no AI) since `config.js` is not included.

**To enable AI on GitHub Pages:**

**Option 1: Use Rule-Based Mode** (Recommended - No API key needed)
- The chatbot works perfectly without AI using pattern matching
- No API costs, instant responses, works offline
- Best for public demos and POCs

**Option 2: Client-Side API Key** (For personal/internal use only)
- Edit `config.js` with your API key
- Remove `config.js` from `.gitignore`
- Commit and push
- **⚠️ WARNING:** Your API key will be publicly visible! Only do this for demos or if you're okay with public access to your API key.

**Option 3: Build a Backend** (Recommended for production)
- Set up a backend server (Node.js, Python, etc.)
- Store API keys securely on server
- Have frontend call your backend instead of Groq directly
- Prevents API key exposure

## 📁 Project Structure

```
collegeWebsiteChatbot/
├── college-website.html    # Main website
├── chatbot.js               # Chatbot logic
├── knowledge-base.js        # College data and FAQs
├── styles.css               # Styling (light blue theme)
├── config.example.js        # Configuration template
├── config.js                # Your API keys (NOT in git)
├── .gitignore               # Excludes sensitive files
├── README.md                # This file
├── API_SETUP.md             # API configuration guide
└── PROJECT_SUMMARY.md       # Technical details
```

## 🔧 Configuration

### API Modes

Edit `config.js` to switch between modes:

```javascript
const CONFIG = {
    apiMode: 'groq',      // Options: 'groq', 'ollama', 'rule-based'
    // ...
};
```

- **groq**: Fast, free cloud AI (requires API key)
- **ollama**: Local AI models (requires Ollama installed)
- **rule-based**: Pattern matching (no setup required)

### Customize Knowledge Base

Edit `knowledge-base.js` to update:
- College information
- Courses and programs
- Admission details
- FAQ responses

## 🎨 Customize Appearance

The chatbot features a modern light blue/cyan color scheme. Edit `styles.css` to customize:
- Colors and theme (currently `#00d4ff` and `#00b4d8`)
- Chat window size
- Button position
- Animations

## 🔐 Security Best Practices

1. **Never commit `config.js`** - It's in `.gitignore` for a reason
2. **Don't hardcode API keys** - Use the config file
3. **Rotate keys regularly** - Get new keys periodically
4. **Monitor usage** - Check your Groq dashboard for unusual activity
5. **For production** - Use a backend server to hide API keys

## 📊 Features Comparison

| Feature | Groq API | Ollama | Rule-based |
|---------|----------|--------|------------|
| Speed | ⚡⚡⚡ | 🐌 | ⚡⚡⚡ |
| Quality | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Cost | Free | Free | Free |
| Setup | Easy | Hard | Easy |
| Internet | Required | Not required | Not required |
| Streaming | ✅ | ✅ | ❌ |

## 🐛 Troubleshooting

### Chatbot not responding?
1. Check browser console for errors (F12)
2. Verify `config.js` exists and has valid API key
3. Check Groq API status: https://status.groq.com

### API key not working?
1. Get a new key from https://console.groq.com
2. Make sure you copied the entire key
3. Check for extra spaces in `config.js`

### Streaming not working?
1. Clear browser cache (Ctrl+Shift+R)
2. Check if `config.js` is loaded (view page source)
3. Verify API mode is set to 'groq' or 'ollama'

### Messages appearing in wrong order?
1. Hard refresh the page (Ctrl+Shift+R)
2. Clear browser cache
3. Check console for errors

## 📝 License

MIT License - feel free to use this for your college or organization!

## 🙏 Credits

Built with:
- **Groq API** - Ultra-fast AI inference
- **Claude Code** - Development assistant
- **Vanilla JavaScript** - No frameworks needed!

## 📧 Support

For questions or issues:
1. Check the [API Setup Guide](API_SETUP.md)
2. Read the [Project Summary](PROJECT_SUMMARY.md)
3. Open an issue on GitHub

---

**Made with ❤️ for educational institutions**

**Version**: 1.0
**Last Updated**: November 2024
=======
# collegeWebsiteChatbot
Chatbot with college website knowledge base to answer any queries related to college related information.
>>>>>>> edec7d7b290d0142bdc371ccc281ca8cf32242ab
