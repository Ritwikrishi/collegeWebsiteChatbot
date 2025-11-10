"""
Sitemap Parser - Automatically discovers and parses sitemap.xml files
"""
import requests
import xml.etree.ElementTree as ET
from urllib.parse import urljoin, urlparse
import gzip
from io import BytesIO

class SitemapParser:
    def __init__(self, base_url, timeout=10):
        """
        Initialize sitemap parser

        Args:
            base_url: Base URL of the website (e.g., "https://example.com")
            timeout: Request timeout in seconds
        """
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })

    def discover_sitemap(self):
        """
        Discover sitemap URL from common locations and robots.txt

        Returns:
            str: Sitemap URL if found, None otherwise
        """
        # Common sitemap locations
        common_locations = [
            '/sitemap.xml',
            '/sitemap_index.xml',
            '/sitemap1.xml',
            '/sitemap.xml.gz',
            '/wp-sitemap.xml',  # WordPress
        ]

        # Try common locations first
        for path in common_locations:
            url = urljoin(self.base_url, path)
            if self._check_url_exists(url):
                print(f"✓ Found sitemap at: {url}")
                return url

        # Try robots.txt
        robots_url = urljoin(self.base_url, '/robots.txt')
        try:
            response = self.session.get(robots_url, timeout=self.timeout)
            if response.status_code == 200:
                for line in response.text.split('\n'):
                    if line.lower().startswith('sitemap:'):
                        sitemap_url = line.split(':', 1)[1].strip()
                        print(f"✓ Found sitemap in robots.txt: {sitemap_url}")
                        return sitemap_url
        except Exception as e:
            pass

        print(f"⚠ No sitemap found for {self.base_url}")
        return None

    def _check_url_exists(self, url):
        """Check if URL exists (returns 200)"""
        try:
            response = self.session.head(url, timeout=self.timeout, allow_redirects=True)
            return response.status_code == 200
        except:
            return False

    def parse_sitemap(self, sitemap_url):
        """
        Parse sitemap XML and extract URLs

        Args:
            sitemap_url: URL of the sitemap

        Returns:
            list: List of dicts with url, priority, lastmod
        """
        try:
            response = self.session.get(sitemap_url, timeout=self.timeout)
            response.raise_for_status()

            # Handle gzipped sitemaps
            content = response.content
            if sitemap_url.endswith('.gz'):
                content = gzip.decompress(content)

            # Parse XML
            root = ET.fromstring(content)

            # Check if it's a sitemap index (contains other sitemaps)
            if 'sitemapindex' in root.tag:
                return self._parse_sitemap_index(root)
            else:
                return self._parse_urlset(root)

        except Exception as e:
            print(f"✗ Error parsing sitemap {sitemap_url}: {e}")
            return []

    def _parse_sitemap_index(self, root):
        """Parse sitemap index (nested sitemaps)"""
        all_urls = []

        # Extract namespace
        ns = {'ns': root.tag.split('}')[0].strip('{')} if '}' in root.tag else {}

        # Get all sitemap locations
        sitemap_locs = root.findall('.//ns:loc', ns) if ns else root.findall('.//loc')

        print(f"  Found sitemap index with {len(sitemap_locs)} sitemaps")

        for loc in sitemap_locs:
            sitemap_url = loc.text.strip()
            print(f"  Parsing nested sitemap: {sitemap_url}")
            urls = self.parse_sitemap(sitemap_url)
            all_urls.extend(urls)

        return all_urls

    def _parse_urlset(self, root):
        """Parse regular sitemap (urlset)"""
        urls = []

        # Extract namespace
        ns = {'ns': root.tag.split('}')[0].strip('{')} if '}' in root.tag else {}

        # Get all URL entries
        url_elements = root.findall('.//ns:url', ns) if ns else root.findall('.//url')

        for url_elem in url_elements:
            loc = url_elem.find('ns:loc', ns) if ns else url_elem.find('loc')
            if loc is None or not loc.text:
                continue

            priority = url_elem.find('ns:priority', ns) if ns else url_elem.find('priority')
            lastmod = url_elem.find('ns:lastmod', ns) if ns else url_elem.find('lastmod')

            urls.append({
                'url': loc.text.strip(),
                'priority': float(priority.text) if priority is not None and priority.text else None,
                'lastmod': lastmod.text.strip() if lastmod is not None and lastmod.text else None
            })

        return urls

    def get_all_urls(self, max_urls=None):
        """
        Discover and parse sitemap, return all URLs

        Args:
            max_urls: Maximum number of URLs to return

        Returns:
            list: List of URL dicts
        """
        sitemap_url = self.discover_sitemap()
        if not sitemap_url:
            return []

        urls = self.parse_sitemap(sitemap_url)

        if max_urls and len(urls) > max_urls:
            urls = urls[:max_urls]

        print(f"✓ Discovered {len(urls)} URLs from sitemap")
        return urls


if __name__ == "__main__":
    # Test with Bharati College
    parser = SitemapParser("https://www.bharaticollege.du.ac.in/")
    urls = parser.get_all_urls()

    print(f"\nFound {len(urls)} URLs")
    if urls:
        print("\nFirst 5 URLs:")
        for url_data in urls[:5]:
            print(f"  - {url_data['url']} (priority: {url_data['priority']})")
