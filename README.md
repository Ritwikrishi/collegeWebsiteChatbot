# College Website Chatbot with RAG 🤖

An intelligent AI-powered chatbot for college websites with **RAG (Retrieval-Augmented Generation)**, automatic web scraping, and streaming responses. The chatbot answers questions using actual content scraped from college websites.

![Chatbot Demo](https://img.shields.io/badge/Status-Live-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## ✨ Features

### Core Features
- 🚀 **Real-time Streaming Responses** - ChatGPT-like word-by-word text generation
- 🧠 **RAG (Retrieval-Augmented Generation)** - Answers based on actual college website content
- 🕷️ **Smart Web Scraper** - Automatically discovers and scrapes college websites
- 🔍 **Semantic Search** - Finds relevant information using AI embeddings
- 💬 **Context-Aware** - Maintains conversation history
- 📚 **Source Citations** - Shows links to source pages

### Technical Features
- 🤖 **Groq API Integration** - Fast, free cloud AI inference
- 🔄 **Automatic URL Discovery** - Uses sitemap.xml to find all pages
- 🎯 **Intelligent Filtering** - Prioritizes important pages (admissions, courses, etc.)
- 📊 **Vector Embeddings** - Browser-based semantic search with Transformers.js
- 🎨 **Modern UI** - Responsive design with smooth animations
- 🔐 **Secure** - API keys kept separate from codebase

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Website    │────▶│ Smart Scraper│────▶│ Documents   │
│ (Sitemap)   │     │ + Processor  │     │ (Chunks)    │
└─────────────┘     └──────────────┘     └─────────────┘
                                                 │
                                                 ▼
                                          ┌─────────────┐
                                          │ Embeddings  │
                                          │ Generator   │
                                          └─────────────┘
                                                 │
                                                 ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   User      │────▶│   Chatbot    │────▶│  RAG Search │
│   Query     │     │  (Frontend)  │     │   + LLM     │
└─────────────┘     └──────────────┘     └─────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js (optional, for local server)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Ritwikrishi/collegeWebsiteChatbot.git
cd collegeWebsiteChatbot
```

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- `requests` - HTTP library for web scraping
- `beautifulsoup4` - HTML parsing
- `html2text` - HTML to Markdown conversion
- `sentence-transformers` - Generate embeddings for RAG
- `torch` - Deep learning library (required by sentence-transformers)

### 3. Configure API Keys

```bash
# Copy the example config file
cp config.example.js config.js
```

Edit `config.js` and add your Groq API key:
```javascript
const CONFIG = {
    groq: {
        apiKey: 'YOUR_GROQ_API_KEY_HERE', // Get from https://console.groq.com
        model: 'llama-3.1-8b-instant',
        endpoint: 'https://api.groq.com/openai/v1/chat/completions'
    },
    apiMode: 'groq'
};
```

### 4. Scrape College Website & Generate Knowledge Base

```bash
# Step 1: Configure the scraper (edit scraper_config.json)
# Change base_url to your target college website

# Step 2: Run the scraper
python run_scraper.py

# Step 3: Process documents into chunks
python process_documents.py

# Step 4: Generate embeddings for RAG
python generate_embeddings.py
```

**Output:** Creates `data/embeddings.json` (~15-20 MB) with the knowledge base.

### 5. Run Locally

```bash
# Start local server
python -m http.server 8000

# Or use Node.js
npx http-server -p 8000
```

Visit: `http://localhost:8000/index.html`

## 📁 Project Structure

```
collegeWebsiteChatbot/
├── index.html                  # Main website (Bharati College)
├── chatbot.js                  # Chatbot with RAG integration
├── rag-client.js               # RAG search client (Transformers.js)
├── knowledge-base.js           # Fallback knowledge base
├── styles.css                  # UI styling
├── config.js                   # API keys (NOT in git)
├── config.example.js           # Config template
│
├── Smart Scraper System
├── sitemap_parser.py           # Discovers URLs from sitemap.xml
├── url_filter.py               # Filters & prioritizes URLs
├── smart_scraper.py            # Main scraper (HTML to Markdown)
├── run_scraper.py              # CLI to run scraper
├── scraper_config.json         # Scraper configuration
│
├── RAG Pipeline
├── process_documents.py        # Chunks documents for RAG
├── generate_embeddings.py      # Creates vector embeddings
│
├── Data (Generated)
├── data/
│   ├── scraped_data.json       # Raw scraped content
│   ├── knowledge_base.json     # Chunked documents
│   └── embeddings.json         # Vector embeddings (15-20 MB)
│
├── Documentation
├── README.md                   # This file
├── README_SCRAPER.md           # Detailed scraper guide
├── API_SETUP.md               # API configuration guide
└── requirements.txt            # Python dependencies
```

## 🕷️ Smart Scraper System

### How It Works

1. **Sitemap Discovery** - Automatically finds sitemap.xml from the college website
2. **URL Filtering** - Filters URLs by keywords (admission, course, department, etc.)
3. **Priority Scoring** - Ranks URLs by importance
4. **Content Extraction** - Scrapes HTML and converts to clean Markdown
5. **No Hardcoded URLs** - Works with any college website!

### Configuration

Edit `scraper_config.json`:

```json
{
  "base_url": "https://www.bharaticollege.du.ac.in/",
  "max_pages": 150,
  "delay": 2,
  "filters": {
    "include_keywords": ["admission", "course", "department"],
    "exclude_keywords": ["login", "admin"],
    "min_words": 0
  }
}
```

### Usage

```bash
# Scrape with default config
python run_scraper.py

# Scrape with custom config
python run_scraper.py my_config.json
```

**See [README_SCRAPER.md](README_SCRAPER.md) for detailed documentation.**

## 🧠 RAG (Retrieval-Augmented Generation)

### How It Works

1. **User asks question** → "What courses does Bharati College offer?"
2. **Semantic Search** → Searches knowledge base using embeddings
3. **Find relevant chunks** → Top 3 most relevant content pieces
4. **Augment prompt** → Adds context to LLM prompt
5. **Generate answer** → LLM generates accurate response with sources

### Embedding Model

- **Model**: `all-MiniLM-L6-v2` (384 dimensions)
- **Python**: sentence-transformers library
- **Browser**: Transformers.js (same model)
- **Search**: Cosine similarity

### Benefits

✅ **Accurate answers** - Based on actual college data
✅ **Up-to-date** - Re-scrape anytime to update knowledge
✅ **Source citations** - Shows links to original pages
✅ **No hallucinations** - LLM answers from provided context

## 🎯 Use Cases

### For Different Colleges

1. **Change target website**
   ```json
   // scraper_config.json
   {
     "base_url": "https://your-college.edu/"
   }
   ```

2. **Run pipeline**
   ```bash
   python run_scraper.py
   python process_documents.py
   python generate_embeddings.py
   ```

3. **Deploy** - Your chatbot now knows about the new college!

### For Different Sections

Customize `include_keywords` in config to focus on specific sections:
```json
{
  "include_keywords": ["research", "faculty", "publication"]
}
```

## 🌐 Deploy to GitHub Pages

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Add RAG chatbot with smart scraper"
git push origin main
```

### Step 2: Enable GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Select **main** branch
3. Click **Save**
4. Wait 1-2 minutes

Live at: `https://YOUR_USERNAME.github.io/collegeWebsiteChatbot/`

### ⚠️ Important: API Keys on GitHub Pages

**Option 1: Rule-Based Mode** (No API key)
- Chatbot works without AI using pattern matching
- Good for demos

**Option 2: Expose API Key** (For personal demos only)
- Remove `config.js` from `.gitignore`
- Commit and push
- ⚠️ Your key will be public!

**Option 3: Backend Server** (Recommended for production)
- Build a backend to hide API keys
- Frontend calls your backend API

## 🔧 Configuration Options

### API Modes

```javascript
// config.js
const CONFIG = {
    apiMode: 'groq',      // 'groq', 'ollama', or 'rule-based'
    // ...
};
```

### Scraper Settings

```json
{
  "max_pages": 150,        // Maximum URLs to scrape
  "delay": 2,              // Seconds between requests
  "min_words": 0,          // Minimum words per page (0 = all)
  "priority_keywords": {
    "high": ["admission", "course"],     // +20 points
    "medium": ["faculty", "research"],   // +10 points
    "low": ["event", "news"]             // +5 points
  }
}
```

## 📊 Features Comparison

| Feature | With RAG | Without RAG |
|---------|----------|-------------|
| Accuracy | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Up-to-date | ✅ Rescrape anytime | ❌ Manual updates |
| Sources | ✅ Shows links | ❌ No sources |
| Setup | 🔧 Requires pipeline | ✅ Simple |
| Knowledge | 🌐 Entire website | 📝 Hardcoded |

## 🐛 Troubleshooting

### Scraper Issues

**Problem:** No pages scraped
```bash
# Solution 1: Set min_words to 0
"min_words": 0

# Solution 2: Check if website has sitemap
# Visit: https://example.com/sitemap.xml
```

**Problem:** Import errors
```bash
pip install -r requirements.txt
```

### RAG Issues

**Problem:** Chatbot doesn't show sources
```
1. Check if data/embeddings.json exists
2. Check browser console for errors (F12)
3. Verify rag-client.js is loaded
```

**Problem:** Slow loading
```
Embeddings file is large (15-20 MB)
- First load takes 5-10 seconds
- Subsequent loads are cached
```

## 📝 Example: Adding New College

```bash
# 1. Update config
{
  "base_url": "https://newcollege.edu/"
}

# 2. Run pipeline
python run_scraper.py
python process_documents.py
python generate_embeddings.py

# 3. Update branding
# Edit index.html - change college name, logo, etc.
# Edit chatbot.js - update welcome message

# 4. Test locally
python -m http.server 8000

# 5. Deploy
git add .
git commit -m "Add NewCollege chatbot"
git push
```

## 🔐 Security Best Practices

1. ✅ Never commit `config.js`
2. ✅ Add `config.js` to `.gitignore`
3. ✅ Rotate API keys regularly
4. ✅ Monitor API usage
5. ✅ Use backend server for production

## 📚 Documentation

- **[README_SCRAPER.md](README_SCRAPER.md)** - Detailed scraper guide
- **[API_SETUP.md](API_SETUP.md)** - API configuration
- **scraper_config.json** - Configuration reference

## 🙏 Credits

Built with:
- **Groq API** - Ultra-fast AI inference
- **Transformers.js** - Browser-based ML
- **sentence-transformers** - Embedding generation
- **BeautifulSoup** - Web scraping
- **Claude Code** - Development assistant

## 📧 Support

For questions or issues:
1. Check documentation files
2. Open an issue on GitHub
3. Review troubleshooting section

## 📝 License

MIT License - Free to use for educational institutions and personal projects.

---

**Made with ❤️ for educational institutions**

**Live Demo**: [Bharati College Chatbot](https://ritwikrishi.github.io/collegeWebsiteChatbot/)

**Version**: 2.0 (with RAG & Smart Scraper)
**Last Updated**: November 2025
