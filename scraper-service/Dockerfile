# Image de base : Python léger
FROM python:3.12-slim

# Dossier de travail dans le conteneur
WORKDIR /app

# Pas de fichiers .pyc, et logs affichés tout de suite
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# 1) On installe d'abord les dépendances (mis en cache par Docker)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2) Puis on copie le code
COPY scraper_engine.py .

# Sécurité : on ne tourne pas en root
RUN useradd --create-home appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "scraper_engine:app", "--host", "0.0.0.0", "--port", "8000"]