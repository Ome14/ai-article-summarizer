# scraper.py
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import sys

def fetch_article_content(url):
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.set_extra_http_headers({
                "User-Agent": "Mozilla/5.0"
            })
            page.goto(url, timeout=30000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)

            soup = BeautifulSoup(page.content(), "html.parser")
            paragraphs = soup.find_all("p")
            if not paragraphs:
                return ""
            return "\n\n".join(p.get_text(strip=True) for p in paragraphs).strip()

    except Exception as e:
        print(f"Error extracting content: {e}", file=sys.stderr)
        return ""

# Run as CLI for subprocess use
if __name__ == "__main__":
    if len(sys.argv) > 1:
        url = sys.argv[1]
        content = fetch_article_content(url)
        if content:
            print(content)
        else:
            print("", end="")
    else:
        print(" No URL provided.", file=sys.stderr)
