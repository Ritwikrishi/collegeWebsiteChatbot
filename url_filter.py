"""
URL Filter - Filters and prioritizes URLs for college websites
"""
from urllib.parse import urlparse, urljoin
import re

class URLFilter:
    def __init__(self, base_url, config):
        """
        Initialize URL filter

        Args:
            base_url: Base URL of website
            config: Configuration dict with filters
        """
        self.base_url = base_url.rstrip('/')
        self.base_domain = urlparse(base_url).netloc
        self.config = config

    def is_valid_url(self, url):
        """
        Check if URL should be scraped

        Args:
            url: URL to check

        Returns:
            bool: True if URL should be scraped
        """
        parsed = urlparse(url)

        # Must be same domain
        if parsed.netloc != self.base_domain:
            return False

        # Check excluded extensions
        exclude_ext = self.config.get('exclude_extensions', [])
        if any(url.lower().endswith(ext) for ext in exclude_ext):
            return False

        # Check excluded keywords
        exclude_keywords = self.config.get('exclude_keywords', [])
        url_lower = url.lower()
        if any(keyword in url_lower for keyword in exclude_keywords):
            return False

        # Check included keywords (if specified)
        include_keywords = self.config.get('include_keywords', [])
        if include_keywords:
            if not any(keyword in url_lower for keyword in include_keywords):
                return False

        return True

    def filter_urls(self, urls):
        """
        Filter list of URLs

        Args:
            urls: List of URL strings or dicts with 'url' key

        Returns:
            list: Filtered URLs
        """
        filtered = []
        for url_data in urls:
            url = url_data if isinstance(url_data, str) else url_data.get('url')
            if url and self.is_valid_url(url):
                filtered.append(url_data)

        return filtered

    def calculate_priority(self, url, sitemap_priority=None, depth=0):
        """
        Calculate priority score for URL

        Args:
            url: URL to score
            sitemap_priority: Priority from sitemap (0.0-1.0)
            depth: Depth from homepage

        Returns:
            float: Priority score (higher = more important)
        """
        score = 0.0

        # Base score from sitemap
        if sitemap_priority is not None:
            score += sitemap_priority * 50

        parsed = urlparse(url)
        path = parsed.path.lower()
        url_lower = url.lower()

        # Homepage gets high priority
        if path in ['/', '/index.html', '/home/']:
            score += 30

        # Keyword matching
        priority_keywords = self.config.get('priority_keywords', {
            'high': ['admission', 'course', 'program', 'department', 'fee'],
            'medium': ['faculty', 'research', 'facility', 'infrastructure', 'placement'],
            'low': ['event', 'news', 'gallery', 'notice']
        })
        for priority_level, keywords in priority_keywords.items():
            for keyword in keywords:
                if keyword in url_lower:
                    if priority_level == 'high':
                        score += 20
                    elif priority_level == 'medium':
                        score += 10
                    else:  # low
                        score += 5
                    break  # Count each keyword level once

        # Depth penalty (deeper = less important)
        score -= depth * 5

        return max(score, 0.0)

    def prioritize_urls(self, urls, max_urls=None):
        """
        Sort URLs by priority and optionally limit

        Args:
            urls: List of URL dicts with 'url', 'priority', etc.
            max_urls: Maximum number of URLs to return

        Returns:
            list: Prioritized URLs
        """
        # Calculate scores
        scored_urls = []
        for url_data in urls:
            url = url_data if isinstance(url_data, str) else url_data.get('url')
            sitemap_priority = None if isinstance(url_data, str) else url_data.get('priority')

            score = self.calculate_priority(url, sitemap_priority)

            scored_urls.append({
                'url': url,
                'score': score,
                'sitemap_priority': sitemap_priority
            })

        # Sort by score (descending)
        scored_urls.sort(key=lambda x: x['score'], reverse=True)

        # Limit if specified
        if max_urls:
            scored_urls = scored_urls[:max_urls]

        return scored_urls


if __name__ == "__main__":
    # Test filtering
    config = {
        'include_keywords': ['admission', 'course', 'department'],
        'exclude_keywords': ['login', 'admin'],
        'exclude_extensions': ['.pdf', '.jpg'],
        'priority_keywords': {
            'high': ['admission', 'course'],
            'medium': ['faculty', 'research'],
            'low': ['event', 'news']
        }
    }

    filter = URLFilter("https://www.bharaticollege.du.ac.in/", config)

    test_urls = [
        {'url': 'https://www.bharaticollege.du.ac.in/admissions', 'priority': 0.9},
        {'url': 'https://www.bharaticollege.du.ac.in/course/bsc', 'priority': 0.8},
        {'url': 'https://www.bharaticollege.du.ac.in/login', 'priority': 0.5},
        {'url': 'https://www.bharaticollege.du.ac.in/document.pdf', 'priority': 0.7},
    ]

    filtered = filter.filter_urls(test_urls)
    print(f"Filtered: {len(filtered)}/{len(test_urls)} URLs")

    prioritized = filter.prioritize_urls(filtered)
    for item in prioritized:
        print(f"  {item['url']} - Score: {item['score']}")
