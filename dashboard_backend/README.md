# ClinicFlow Backend

A comprehensive FastAPI backend for the ClinicFlow clinic management system.

## Features

- **Google OAuth Authentication** - Secure authentication using Google Sign-In
- **Role-Based Access Control** - Owner, Admin, and Doctor roles with granular permissions
- **Appointment Management** - Full CRUD with status tracking, scheduling grid
- **Patient Management** - Patient records with history and relationships
- **Intake Forms** - Customizable intake templates with public submission via tokens
- **Real-time Updates** - WebSocket support for live dashboard updates
- **AI Integration** - OpenAI integration for intake form summaries

## Tech Stack

- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL 15+ with SQLAlchemy 2.0 async
- **Authentication**: Google OAuth 2.0 + JWT tokens
- **Validation**: Pydantic v2
- **Migrations**: Alembic
- **Cache**: Redis (optional)
- **Background Tasks**: Celery (optional)

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis (optional)
- Google OAuth credentials

### 1. Clone and Setup

```bash
cd dashboard_backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `SECRET_KEY` - Application secret key
- `JWT_SECRET_KEY` - JWT signing key

### 3. Initialize Database

```bash
# Run migrations
alembic upgrade head

# Or seed with demo data
python seed_data.py
```

### 4. Run Development Server

```bash
uvicorn app.main:app --reload
```

API will be available at http://localhost:8000

- Swagger docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Using Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/google/url` | Get Google OAuth URL |
| POST | `/api/auth/google/callback` | Handle OAuth callback |
| POST | `/api/auth/signup` | Sign up new user with Google |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout and invalidate session |
| GET | `/api/auth/me` | Get current user info |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | List appointments |
| GET | `/api/appointments/today` | Today's appointments |
| GET | `/api/appointments/unconfirmed` | Unconfirmed appointments |
| POST | `/api/appointments` | Create appointment |
| PUT | `/api/appointments/{id}` | Update appointment |
| POST | `/api/appointments/{id}/confirm` | Confirm appointment |
| POST | `/api/appointments/{id}/cancel` | Cancel appointment |
| POST | `/api/appointments/{id}/check-in` | Check in patient |
| POST | `/api/appointments/{id}/reschedule` | Reschedule appointment |

### Schedule
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schedule/grid` | Get schedule grid for a date |
| GET | `/api/schedule/available-slots` | Get available time slots |
| GET | `/api/schedule/week` | Get week schedule overview |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | List patients |
| GET | `/api/patients/search` | Quick search patients |
| GET | `/api/patients/{id}` | Get patient details |
| POST | `/api/patients` | Create patient |
| PUT | `/api/patients/{id}` | Update patient |
| GET | `/api/patients/{id}/appointments` | Patient's appointment history |

### Intake Forms
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/intake/templates` | List intake templates |
| POST | `/api/intake/templates` | Create template |
| POST | `/api/intake/tokens/generate` | Generate public intake token |
| GET | `/api/public/intake/{token}` | Get public intake form |
| POST | `/api/public/intake/{token}` | Submit public intake form |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/admin/summary` | Admin dashboard stats |
| GET | `/api/dashboard/doctor/summary` | Doctor dashboard stats |
| GET | `/api/dashboard/needs-attention` | Items needing attention |
| GET | `/api/dashboard/stats/daily` | Daily statistics |

### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings/clinic` | Get clinic settings |
| PUT | `/api/settings/clinic` | Update clinic settings |
| GET | `/api/settings/doctors` | List doctors |
| PUT | `/api/settings/doctors/{id}` | Update doctor profile |
| GET | `/api/settings/users` | List users (admin) |

### WebSocket
| Endpoint | Description |
|----------|-------------|
| `/ws?token={jwt}` | Real-time updates connection |

## Authentication Flow

### New User Signup (Web)
1. User fills signup form with clinic name and clicks "Sign up with Google"
2. Frontend redirects to Google OAuth
3. Google authenticates and redirects back with code
4. Frontend sends code + signup data to `/api/auth/signup`
5. Backend creates clinic, user, and returns JWT tokens

### Existing User Login
1. User clicks "Sign in with Google"
2. Frontend redirects to Google OAuth
3. Google authenticates and redirects back with code
4. Frontend sends code to `/api/auth/google/callback`
5. Backend validates, returns JWT tokens

## Role Permissions

| Permission | Owner | Admin | Doctor |
|------------|-------|-------|--------|
| View appointments | ✅ | ✅ | Own only |
| Create appointments | ✅ | ✅ | ❌ |
| Manage patients | ✅ | ✅ | View only |
| Manage users | ✅ | ❌ | ❌ |
| Clinic settings | ✅ | ✅ | ❌ |
| View dashboard | ✅ | ✅ | Own stats |
| Create notes | ✅ | ❌ | ✅ |

## Development

### Running Tests

```bash
pytest
pytest --cov=app tests/
```

### Database Migrations

```bash
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Code Style

```bash
# Format code
black app/
isort app/

# Lint
flake8 app/
mypy app/
```

## Project Structure

```
dashboard_backend/
├── alembic/              # Database migrations
│   ├── env.py
│   └── versions/
├── app/
│   ├── api/              # API routes
│   │   ├── auth.py
│   │   ├── appointments.py
│   │   ├── patients.py
│   │   ├── intake.py
│   │   ├── public.py
│   │   ├── dashboard.py
│   │   ├── schedule.py
│   │   ├── settings.py
│   │   ├── doctor_notes.py
│   │   ├── follow_ups.py
│   │   ├── websocket.py
│   │   └── deps.py       # Dependencies
│   ├── core/             # Core utilities
│   │   ├── security.py
│   │   ├── permissions.py
│   │   └── exceptions.py
│   ├── models/           # SQLAlchemy models
│   │   ├── clinic.py
│   │   ├── user.py
│   │   ├── doctor.py
│   │   ├── patient.py
│   │   ├── appointment.py
│   │   └── ...
│   ├── schemas/          # Pydantic schemas
│   │   ├── user.py
│   │   ├── appointment.py
│   │   ├── patient.py
│   │   └── ...
│   ├── services/         # Business logic
│   │   └── auth_service.py
│   ├── config.py         # Settings
│   ├── database.py       # Database setup
│   └── main.py           # FastAPI app
├── .env.example
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── alembic.ini
└── seed_data.py
```

## License

MIT License
