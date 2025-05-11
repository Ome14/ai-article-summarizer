#  AI Article Summarizer

This is a full-stack AI-powered article summarization app.  
It fetches news articles from **Saudi Gazette**, and allows users to input any text or URL to summarize using GPT in Arabic.

---

##  Features

-  Fetch articles from Saudi Gazette homepage
-  Summarize articles using OpenAI GPT-4o
-  Summarize any custom URL
-  Summarize any custom text (max 5000 characters)
-  Local history of the last 5 summaries
-  Dark/Light mode
-  Built with Docker & Docker Compose

---

##  Tech Stack

| Layer      | Tech           |
|------------|----------------|
| Frontend   | React + Axios + CSS |
| Backend    | FastAPI (Python) |
| AI         | OpenAI GPT-4o |
| Scraper    | Requests + BeautifulSoup + Playwright |
| Deployment | Docker, Nginx, docker-compose |

---

##  API Endpoints

### 🔹 `GET /crawler/articles`
Fetches the latest articles from Saudi Gazette

### 🔹 `POST /articles/summarize`
Summarizes custom input text  
**Body:**
```json
{
  "text": "your text here",
  "max_tokens": 150,
  "model": "gpt-4o-mini"
}
```

### 🔹 `POST /articles/summarize-url?url=...`
Summarizes article from a URL using Playwright

---

## ⚙️ Installation with Docker

### 1. Clone the repo
```bash
git clone https://github.com/your-username/ai-article-summarizer.git
cd ai-article-summarizer
```

### 2. Add your OpenAI Key
Create a file called `.env`:
```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
```

Or edit `docker-compose.yml` directly.

### 3. Build & run
```bash
docker-compose up --build
```

### Access the app
- Frontend: http://localhost:3000  
- API Docs: http://localhost:8000/docs

---

## Notes & Assumptions

- `User-Agent` header is used when scraping to avoid blocking
- Maximum input size = **5000 characters**
- Uses `playwright` to support dynamic websites like CNN and saudigazette
- Scraper caches articles for 1 hour to reduce load
- Frontend stores history in `localStorage` (last 5 summaries)

---

##  Demo

> 📽️ You can add a GIF here showing the app in action

---

## Folder Structure

```
AI_task/
├── backend/
│   ├── main.py
│   ├── scraper.py
│   ├── requirements.txt
│   ├── Dockerfile
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Author

Built by **Omar Mahmoud** 
