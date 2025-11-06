# API Setup Guide

## ✅ Groq API (Recommended - FREE & FAST!)

Your chatbot is now configured to use Groq API!

### Why Groq?
- ⚡ **Lightning fast** - Responses in milliseconds
- 🆓 **100% FREE** - Generous free tier
- 🌐 **Cloud-based** - No local installation needed
- 📊 **High quality** - Uses Llama 3.1 model

### Your Current Setup:
- **Model**: `llama-3.1-8b-instant`
- **API Key**: Already configured! ✅
- **Mode**: `groq` (active)

### Free Tier Limits:
- **30 requests/minute**
- **6,000 tokens/minute**
- More than enough for a college chatbot!

### Get Your Own API Key:
1. Visit https://console.groq.com
2. Sign up (free!)
3. Go to API Keys section
4. Create a new API key
5. Copy and paste it in `chatbot.js` line 16

---

## 🔄 Switching Between APIs

Edit line 8 in `chatbot.js`:

```javascript
this.apiMode = 'groq';      // Use Groq API (fast, free, cloud)
// this.apiMode = 'ollama';    // Use local Ollama (slower, local)
// this.apiMode = 'rule-based'; // Use simple pattern matching (no AI)
```

---

## 🎯 Other Free API Options

### 1. **OpenAI Free Tier**
- Website: https://platform.openai.com
- Free credits: $5 for new users
- Models: GPT-3.5-turbo, GPT-4
- Speed: Fast

### 2. **Hugging Face Inference API**
- Website: https://huggingface.co/inference-api
- Free tier: Available
- Models: Many open-source options
- Speed: Medium

### 3. **Cohere**
- Website: https://cohere.ai
- Free tier: 100 calls/month
- Models: Command, Generate
- Speed: Fast

---

## 📊 Comparison

| API | Speed | Cost | Quality | Setup |
|-----|-------|------|---------|-------|
| **Groq** ⭐ | ⚡⚡⚡ | Free | ⭐⭐⭐⭐ | Easy |
| Ollama | 🐌 | Free | ⭐⭐⭐ | Hard |
| OpenAI | ⚡⚡ | $$ | ⭐⭐⭐⭐⭐ | Easy |
| Rule-based | ⚡⚡⚡ | Free | ⭐⭐ | Easy |

---

## 🚀 Your Chatbot is Ready!

Just refresh the page and start chatting. Groq will give you instant, high-quality responses!

**Test it at**: http://localhost:8000/college-website.html
