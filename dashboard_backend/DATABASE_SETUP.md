# Database Setup Instructions

## Error: Connection Refused

The error `connection to server at "localhost" port 5432 failed: Connection refused` means PostgreSQL is not running.

## Solution: Start PostgreSQL Database

You have two options:

### Option 1: Using Docker (Recommended)

```bash
cd dashboard_backend
docker-compose up db
```

This will start PostgreSQL in a Docker container. Keep this terminal open.

Then in another terminal:
```bash
cd dashboard_backend
alembic revision --autogenerate -m "add_google_oauth_and_clinic_fields"
alembic upgrade head
```

### Option 2: Install PostgreSQL Locally

1. Download and install PostgreSQL from https://www.postgresql.org/download/windows/
2. Start PostgreSQL service
3. Create database: `createdb clinicflow`
4. Update `.env` file with your PostgreSQL connection string
5. Run migrations

## Quick Start (Docker)

```bash
# Terminal 1 - Start Database
cd dashboard_backend
docker-compose up db

# Terminal 2 - Run Migrations (wait for database to be ready)
cd dashboard_backend
alembic revision --autogenerate -m "add_google_oauth_and_clinic_fields"
alembic upgrade head

# Terminal 2 - Seed Data
python app/seed.py

# Terminal 2 - Start API Server
uvicorn app.main:app --reload
```

## Verify Database is Running

Check if PostgreSQL is accessible:
```bash
psql -h localhost -U clinicflow -d clinicflow
```

Or check Docker:
```bash
docker ps
# Should show postgres container running
```

