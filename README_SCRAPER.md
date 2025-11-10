# Smart College Website Scraper with RAG

This system automatically scrapes college websites and creates a knowledge base for the chatbot using RAG (Retrieval-Augmented Generation).

## Features

- **Automatic URL Discovery**: Finds URLs from sitemap.xml automatically
- **Intelligent Filtering**: Filters URLs by keywords and relevance
- **Priority Scoring**: Prioritizes important pages (admissions, courses, etc.)
- **HTML to Markdown**: Converts web content to clean text
- **RAG Integration**: Chatbot uses scraped content to answer questions
- **No Hardcoded URLs**: Works with any college website

## Setup

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- `requests` - HTTP library
- `beautifulsoup4` - HTML parsing
- `html2text` - Convert HTML to markdown
- `sentence-transformers` - Generate embeddings for RAG
- `torch` - Required by sentence-transformers

### 2. Configure the Scraper

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

**Important Settings**:
- `min_words`: Set to `0` to include ALL pages (even short ones)
- `max_pages`: Maximum number of pages to scrape
- `delay`: Seconds to wait between requests (be respectful!)

## Usage

### Step 1: Run the Scraper

```bash
python run_scraper.py
```

Or with a custom config:

```bash
python run_scraper.py scraper_config.json
```

This will:
- Discover URLs from the website's sitemap
- Filter and prioritize URLs
- Scrape content and convert to markdown
- Save to `data/scraped_data.json`

**Output**:
```
🔍 Strategy 1: Discovering URLs from sitemap...
✓ Found sitemap at: https://www.bharaticollege.du.ac.in/sitemap.xml
✓ Discovered 248 URLs from sitemap

🔧 Filtering URLs...
✓ 89/248 URLs passed filters
✓ Selected top 89 URLs by priority

📥 Scraping 89 pages...
[1/89] ✓ Scraped (1245 words): https://www.bharaticollege.du.ac.in/admissions
...
✅ Successfully scraped 89/89 pages
💾 Saved to: data/scraped_data.json
```

### Step 2: Process Documents

```bash
python process_documents.py
```

This will:
- Load scraped data
- Split into chunks (500 chars with 50 char overlap)
- Save to `data/knowledge_base.json`

**Output**:
```
📂 Loading: data/scraped_data.json
✓ Loaded 89 pages

🔪 Chunking documents (size=500, overlap=50)...
✓ Created 1247 chunks

💾 Saved 1247 chunks to: data/knowledge_base.json
```

### Step 3: Generate Embeddings

```bash
python generate_embeddings.py
```

This will:
- Load knowledge base chunks
- Generate embeddings using sentence-transformers
- Save to `data/embeddings.json`

**Output**:
```
📂 Loading: data/knowledge_base.json
✓ Loaded 1247 chunks

📦 Loading model: all-MiniLM-L6-v2
✓ Model loaded

🔢 Generating embeddings for 1247 chunks...
Batches: 100%|████████| 39/39 [00:15<00:00,  2.54it/s]
✓ Generated 1247 embeddings
   Dimension: 384

💾 Saved to: data/embeddings.json
   File size: 15.23 MB
```

### Step 4: Test the Chatbot

1. Open `index.html` in your browser
2. Click the chatbot button
3. Ask questions about the college

The chatbot will:
- Search the knowledge base for relevant content
- Use that context to answer your question
- Show source links at the bottom of responses

## How It Works

### 1. Sitemap Discovery (`sitemap_parser.py`)

Automatically finds and parses sitemap.xml:
- Checks common locations (`/sitemap.xml`, `/sitemap_index.xml`)
- Reads sitemap location from `robots.txt`
- Handles nested sitemaps (sitemap index)
- Supports gzip compression

### 2. URL Filtering (`url_filter.py`)

Filters and prioritizes URLs:
- **Include keywords**: Pages must contain these (admission, course, etc.)
- **Exclude keywords**: Skip pages with these (login, admin, etc.)
- **Exclude extensions**: Skip files (.pdf, .jpg, etc.)
- **Priority scoring**: Ranks URLs by importance

### 3. Smart Scraping (`smart_scraper.py`)

Scrapes pages intelligently:
- HTML to markdown conversion
- Removes navigation, footer, scripts
- Respects rate limiting (delay between requests)
- Counts words and filters by minimum

### 4. Document Processing (`process_documents.py`)

Chunks text for RAG:
- Splits into 500-character chunks
- 50-character overlap between chunks
- Preserves metadata (title, URL)

### 5. Embedding Generation (`generate_embeddings.py`)

Creates vector embeddings:
- Uses `all-MiniLM-L6-v2` model
- 384-dimensional vectors
- Same model in Python and JavaScript

### 6. RAG Integration (`rag-client.js`, `chatbot.js`)

Chatbot uses RAG:
- Loads embeddings in browser (Transformers.js)
- Searches for relevant chunks using cosine similarity
- Adds context to chatbot prompt
- Shows source citations

## Troubleshooting

### No pages scraped

**Problem**: `❌ No pages were scraped!`

**Solutions**:
1. Set `min_words: 0` in `scraper_config.json`
2. Check `include_keywords` are not too restrictive
3. Verify the website has a sitemap (visit `/sitemap.xml`)

### robots.txt blocking

**Problem**: `Blocked by robots.txt`

**Solutions**:
1. Make sure you have permission to scrape
2. Contact the website administrator
3. Use manual content instead

### Import errors

**Problem**: `ModuleNotFoundError: No module named 'sentence_transformers'`

**Solution**:
```bash
pip install -r requirements.txt
```

### Chatbot not using RAG

**Problem**: Chatbot doesn't show sources

**Solutions**:
1. Check browser console for errors
2. Verify `data/embeddings.json` exists
3. Make sure `rag-client.js` is loaded in `index.html`

## Configuration Reference

### `scraper_config.json`

```json
{
  "base_url": "https://example.com/",
  "max_pages": 150,          // Max URLs to scrape
  "delay": 2,                // Seconds between requests
  "strategies": {
    "try_sitemap": true      // Use sitemap discovery
  },
  "filters": {
    "include_keywords": [...], // URLs must contain these
    "exclude_keywords": [...], // URLs must NOT contain these
    "exclude_extensions": [...], // Skip these file types
    "min_words": 0           // Minimum words per page (0 = all)
  },
  "priority_keywords": {
    "high": [...],           // +20 points
    "medium": [...],         // +10 points
    "low": [...]             // +5 points
  }
}
```

## Files Generated

- `data/scraped_data.json` - Raw scraped content
- `data/knowledge_base.json` - Chunked documents
- `data/embeddings.json` - Vector embeddings (15-20 MB)

## Command Summary

```bash
# Full pipeline (run in order)
pip install -r requirements.txt
python run_scraper.py
python process_documents.py
python generate_embeddings.py

# Then open index.html in browser
```

## Tips

1. **Start small**: Set `max_pages: 50` for testing
2. **Be respectful**: Use `delay: 2` or higher
3. **Include all pages**: Set `min_words: 0`
4. **Check sitemap**: Visit `https://example.com/sitemap.xml` to verify
5. **Monitor progress**: Watch console output for errors

## Example: Scraping a New College

```bash
# 1. Update scraper_config.json
{
  "base_url": "https://newcollege.edu/"
}

# 2. Run pipeline
python run_scraper.py
python process_documents.py
python generate_embeddings.py

# 3. Test chatbot
# Open index.html and ask: "What courses do you offer?"
```

That's it! The chatbot now has knowledge about the new college.
