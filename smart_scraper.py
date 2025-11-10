"""
Smart Scraper - Automatically scrapes college websites using sitemap and filtering
"""
import requests
from bs4 import BeautifulSoup
import json
import time
from urllib.parse import urljoin, urlparse
import os
from datetime import datetime
from html2text import HTML2Text

from sitemap_parser import SitemapParser
from url_filter import URLFilter


class SmartScraper:
    def __init__(self, base_url, config):
        """
        Initialize smart scraper

        Args:
            base_url: Base URL of website
            config: Configuration dict
        """
        self.base_url = base_url.rstrip('/')
        self.config = config
        self.delay = config.get('delay', 2)

        # Initialize components
        self.sitemap_parser = SitemapParser(base_url)
        self.url_filter = URLFilter(base_url, config.get('filters', {}))

        # HTML to markdown converter
        self.html2text = HTML2Text()
        self.html2text.ignore_links = False
        self.html2text.ignore_images = True
        self.html2text.ignore_emphasis = False
        self.html2text.body_width = 0  # Don't wrap lines

        # Session for requests
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })

        self.scraped_pages = []

    def discover_urls(self):
        """
        Discover URLs using configured strategies

        Returns:
            list: List of prioritized URLs
        """
        strategies = self.config.get('strategies', {})
        all_urls = []

        # Strategy 1: Sitemap
        if strategies.get('try_sitemap', True):
            print("\n🔍 Strategy 1: Discovering URLs from sitemap...")
            sitemap_urls = self.sitemap_parser.get_all_urls()
            if sitemap_urls:
                all_urls.extend(sitemap_urls)
                print(f"✓ Found {len(sitemap_urls)} URLs from sitemap")

        # Filter URLs
        if all_urls:
            print(f"\n🔧 Filtering URLs...")
            filtered = self.url_filter.filter_urls(all_urls)
            print(f"✓ {len(filtered)}/{len(all_urls)} URLs passed filters")

            # Prioritize
            max_pages = self.config.get('max_pages', 100)
            prioritized = self.url_filter.prioritize_urls(filtered, max_pages)
            print(f"✓ Selected top {len(prioritized)} URLs by priority")

            return prioritized

        return []

    def scrape_page(self, url):
        """
        Scrape a single page

        Args:
            url: URL to scrape

        Returns:
            dict: Page data or None if failed
        """
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, 'html.parser')

            # Remove unwanted elements
            for element in soup(['script', 'style', 'nav', 'footer', 'header', 'iframe', 'noscript']):
                element.decompose()

            # Get title
            title = soup.title.string if soup.title else urlparse(url).path

            # Convert to markdown
            markdown_content = self.html2text.handle(str(soup))

            # Clean up markdown
            markdown_content = '\n'.join([
                line for line in markdown_content.split('\n')
                if line.strip() and not line.strip().startswith('#####')
            ])

            # Count words
            word_count = len(markdown_content.split())

            # Check minimum words
            min_words = self.config.get('filters', {}).get('min_words', 0)
            if word_count < min_words:
                print(f"  ⊘ Skipped (only {word_count} words): {url}")
                return None

            print(f"  ✓ Scraped ({word_count} words): {url}")

            return {
                'url': url,
                'title': title.strip() if title else url,
                'content': markdown_content.strip(),
                'word_count': word_count,
                'scraped_at': datetime.now().isoformat()
            }

        except Exception as e:
            print(f"  ✗ Error scraping {url}: {e}")
            return None

    def scrape_all(self):
        """
        Scrape all discovered URLs

        Returns:
            list: List of scraped pages
        """
        # Discover URLs
        urls = self.discover_urls()

        if not urls:
            print("\n❌ No URLs discovered!")
            return []

        print(f"\n📥 Scraping {len(urls)} pages...")
        print(f"⏱ Delay between requests: {self.delay}s\n")

        for i, url_data in enumerate(urls, 1):
            url = url_data['url']
            print(f"[{i}/{len(urls)}]", end=" ")

            page_data = self.scrape_page(url)
            if page_data:
                page_data['priority_score'] = url_data['score']
                self.scraped_pages.append(page_data)

            # Rate limiting
            if i < len(urls):
                time.sleep(self.delay)

        print(f"\n✅ Successfully scraped {len(self.scraped_pages)}/{len(urls)} pages")
        return self.scraped_pages

    def save_to_file(self, output_file):
        """
        Save scraped data to JSON file

        Args:
            output_file: Path to output file
        """
        # Create directory if needed
        os.makedirs(os.path.dirname(output_file), exist_ok=True)

        # Save JSON
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.scraped_pages, f, indent=2, ensure_ascii=False)

        print(f"\n💾 Saved to: {output_file}")
        print(f"📊 Total pages: {len(self.scraped_pages)}")
        total_words = sum(p['word_count'] for p in self.scraped_pages)
        print(f"📝 Total words: {total_words:,}")


def load_config(config_file):
    """Load configuration from JSON file"""
    with open(config_file, 'r', encoding='utf-8') as f:
        return json.load(f)


if __name__ == "__main__":
    # Example: Scrape Bharati College
    config = {
        'base_url': 'https://www.bharaticollege.du.ac.in/',
        'max_pages': 150,
        'delay': 2,
        'strategies': {
            'try_sitemap': True
        },
        'filters': {
            'include_keywords': [
                'admission', 'course', 'program', 'department', 'academic',
                'facility', 'infrastructure', 'fee', 'scholarship', 'placement',
                'career', 'faculty', 'research', 'about', 'contact'
            ],
            'exclude_keywords': [
                'privacy', 'terms', 'cookie', 'legal', 'disclaimer',
                'login', 'admin', 'wp-admin', 'wp-content'
            ],
            'exclude_extensions': [
                '.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif'
            ],
            'min_words': 0  # Set to 0 to include all pages
        },
        'priority_keywords': {
            'high': ['admission', 'course', 'program', 'department', 'fee'],
            'medium': ['faculty', 'research', 'facility', 'infrastructure', 'placement'],
            'low': ['event', 'news', 'gallery', 'notice']
        }
    }

    scraper = SmartScraper(config['base_url'], config)
    scraper.scrape_all()
    scraper.save_to_file('data/scraped_data.json')
