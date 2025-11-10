"""
Run Smart Scraper - Easy CLI to scrape college websites
"""
import json
import sys
from smart_scraper import SmartScraper, load_config


def main():
    print("=" * 60)
    print("  SMART COLLEGE WEBSITE SCRAPER")
    print("=" * 60)

    # Check if config file provided
    if len(sys.argv) > 1:
        config_file = sys.argv[1]
        print(f"\n📋 Loading config from: {config_file}")
        config = load_config(config_file)
    else:
        # Use default config
        print(f"\n📋 Using scraper_config.json")
        config = load_config('scraper_config.json')

    base_url = config.get('base_url')
    print(f"🌐 Target website: {base_url}")

    # Create scraper
    scraper = SmartScraper(base_url, config)

    # Scrape
    pages = scraper.scrape_all()

    # Save
    if pages:
        output_file = 'data/scraped_data.json'
        scraper.save_to_file(output_file)
        print("\n✅ Scraping completed successfully!")
        print(f"\n📌 Next steps:")
        print(f"   1. Run: python process_documents.py")
        print(f"   2. Run: python generate_embeddings.py")
        print(f"   3. Open index.html in browser")
    else:
        print("\n❌ No pages were scraped!")
        print("\n💡 Try:")
        print("   - Setting min_words to 0 in config")
        print("   - Checking include/exclude keywords")
        print("   - Verifying the website has a sitemap")


if __name__ == "__main__":
    main()
