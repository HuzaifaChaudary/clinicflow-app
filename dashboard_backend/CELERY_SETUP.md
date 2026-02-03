# Celery Setup for Automatic Reminders

This system uses Celery with Redis for automatic appointment reminders.

## Prerequisites

1. **Redis** must be running:
   ```bash
   # Install Redis (if not installed)
   # Windows: Download from https://github.com/microsoftarchive/redis/releases
   # Mac: brew install redis
   # Linux: sudo apt-get install redis-server
   
   # Start Redis
   redis-server
   ```

2. **Environment Variables** in `.env`:
   ```env
   # Redis
   REDIS_URL=redis://localhost:6379/0
   
   # Twilio (for SMS)
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   
   # SMTP (for Email)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   SMTP_FROM_EMAIL=your_email@gmail.com
   SMTP_FROM_NAME=ClinicFlow
   ```

## Installation

```bash
pip install -r requirements.txt
```

## Running Celery

You need to run **two processes**:

### 1. Celery Worker (processes tasks)
```bash
# Option 1: Using the script (automatically detects Windows)
python start_celery_worker.py

# Option 2: Direct command
# Windows:
celery -A app.celery_app worker --pool=solo --loglevel=info

# Linux/Mac:
celery -A app.celery_app worker --loglevel=info
```

**Note for Windows:** Celery uses `--pool=solo` on Windows because the default `prefork` pool doesn't work on Windows. The script automatically detects your OS and uses the correct pool type.

### 2. Celery Beat (schedules periodic tasks)
```bash
# Option 1: Using the script
python start_celery_beat.py

# Option 2: Direct command
celery -A app.celery_app beat --loglevel=info
```

## How It Works

- **Celery Beat** runs every hour and schedules reminder tasks
- **Celery Worker** processes the tasks and sends reminders
- Reminders use settings from the database (`confirmation_reminder_hours`, `intake_reminder_hours`)
- SMS and Email are sent based on clinic settings

## Testing

### Manual Trigger (API Endpoints)

1. **Trigger Confirmation Reminders:**
   ```bash
   curl -X POST http://localhost:8000/api/reminders/send-confirmation \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

2. **Trigger Intake Reminders:**
   ```bash
   curl -X POST http://localhost:8000/api/reminders/send-intake \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

3. **Check Task Status:**
   ```bash
   curl http://localhost:8000/api/reminders/status/TASK_ID \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

## Production Deployment

For production, use a process manager like **supervisord** or **systemd**:

### Supervisord Example
```ini
[program:celery_worker]
command=celery -A app.celery_app worker --loglevel=info
directory=/path/to/dashboard_backend
user=www-data
autostart=true
autorestart=true

[program:celery_beat]
command=celery -A app.celery_app beat --loglevel=info
directory=/path/to/dashboard_backend
user=www-data
autostart=true
autorestart=true
```

## Troubleshooting

1. **Redis not running**: Make sure Redis is started before Celery
2. **Tasks not executing**: Check Celery worker logs
3. **Reminders not sending**: Verify Twilio/SMTP credentials in `.env`
4. **Settings not applied**: Ensure clinic settings are saved in the database

