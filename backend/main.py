# main.py
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import subprocess
import openai
import os
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import requests
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Summarization Request Model
class SummarizeRequest(BaseModel):
    text: str = Field(..., max_length=5000)
    max_tokens: int = 150
    model: str = "gpt-4o-mini"

# Get articles from Saudi Gazette
cached_articles = []
last_fetch_time = None

@app.get("/crawler/articles")
def get_articles():
    global cached_articles, last_fetch_time

    if last_fetch_time and (datetime.now() - last_fetch_time) < timedelta(hours=1):
        return {"articles": cached_articles}

    url = "https://saudigazette.com.sa/"
    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        

        articles = []
        for a_tag in soup.find_all("a", href=True):
            href = a_tag['href']
            title = a_tag.get_text(strip=True)
            if "/article/" in href and title and len(title) > 20:
                full_url = href if href.startswith("http") else "https://saudigazette.com.sa" + href
                articles.append({
                    "title": title,
                    "url": full_url,
                    "excerpt": "Click to summarize"
                })

        cached_articles = articles
        last_fetch_time = datetime.now()
        return {"articles": articles}

    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Failed to fetch articles: {str(e)}"})

# Fetch article content from any URL (via scraper.py subprocess)
@app.get("/articles/fetch-content")
def fetch_article_text(url: str = Query(...)):
    try:
        result = subprocess.run(
            ["python", "scraper.py", url],
            capture_output=True,
            text=True,
            timeout=60
        )
        content = result.stdout.strip()
        if not content:
            return JSONResponse(status_code=400, content={"detail": "No content returned from scraper."})
        if len(content) > 5000:
            return JSONResponse(status_code=400, content={"detail": "Content exceeds 5000 characters."})
        return {"content": content}
    except subprocess.TimeoutExpired:
        return JSONResponse(status_code=500, content={"detail": "Timeout while fetching article content."})
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Scraper execution failed: {str(e)}"})

# ✅ Summarize text
@app.post("/articles/summarize")
def summarize_text(data: SummarizeRequest):
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is empty.")
    if len(text) > 5000:
        raise HTTPException(status_code=400, detail="Text too long. Max 5000 characters.")

    try:
        response = openai.ChatCompletion.create(
            model=data.model,
            messages=[
                {"role": "system", "content": "أنت مساعد ذكي يلخص النصوص باللغة العربية."},
                {"role": "user", "content": f"لخّص النص التالي:\n\n{text}"}
            ],
            temperature=0.5
        )
        return {"summary_ar": response["choices"][0]["message"]["content"].strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")
