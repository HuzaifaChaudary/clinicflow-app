# ClinicFlow Backend API

FastAPI backend for ClinicFlow medical clinic management system.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your values
```

3. Start PostgreSQL database:
```bash
docker-compose up db
```

4. Run migrations:
```bash
alembic upgrade head
```

5. Seed initial data:
```bash
python app/seed.py
```

6. Start the API server:
```bash
uvicorn app.main:app --reload
```

API will be available at http://localhost:8000
API docs at http://localhost:8000/docs

