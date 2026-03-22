import requests
import re
from fastapi import FastAPI
import uvicorn

app = FastAPI()

def clean_html(text: str) -> str:
    clean = re.sub(r'<[^>]+>', ' ', text or '')
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean[:400] + "..." if len(clean) > 400 else clean

def search_jobs(keyword: str, location: str, limit: int = 5, offset: int = 0):
    try:
        response = requests.get(
            "https://remoteok.com/api",
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=10
        )
        data = response.json()

        all_jobs = []

        # D'abord les offres qui matchent le mot-clé
        for i, job in enumerate(data):
            if not isinstance(job, dict) or not job.get('position'):
                continue
            title = job.get('position', '')
            tags = job.get('tags', [])
            if keyword.lower() in title.lower() or any(keyword.lower() in t.lower() for t in tags):
                all_jobs.append({
                    "scrapedId": f"match-{i}",
                    "title": title,
                    "company": job.get('company', 'Entreprise'),
                    "location": "Remote — accessible depuis " + location,
                    "description": clean_html(job.get('description', '')),
                    "link": job.get('url', '#')
                })

        # Compléter avec offres générales
        for i, job in enumerate(data):
            if not isinstance(job, dict) or not job.get('position'):
                continue
            scrapedId = f"gen-{i}"
            if not any(j['scrapedId'] == f"match-{i}" for j in all_jobs):
                all_jobs.append({
                    "scrapedId": scrapedId,
                    "title": job.get('position', 'Poste'),
                    "company": job.get('company', 'Entreprise'),
                    "location": "Remote — accessible depuis " + location,
                    "description": clean_html(job.get('description', '')),
                    "link": job.get('url', '#')
                })

        # ✅ Pagination : découper selon offset et limit
        paginated = all_jobs[offset: offset + limit]

        print(f"✅ Page offset={offset} limit={limit} → {len(paginated)} offres retournées sur {len(all_jobs)} total")
        return paginated

    except Exception as e:
        print(f"❌ Erreur: {e}")
        return []

@app.get("/search")
def search(q: str = "développeur", l: str = "Maroc", limit: int = 5, offset: int = 0):
    return search_jobs(q, l, limit, offset)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)