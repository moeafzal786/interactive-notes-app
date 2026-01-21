# Interactive Notes App

## Features
- CRUD notes with tags
- JWT authentication
- Gradient UI

## Setup
1. Clone the repo
2. Install dependencies
3. Run the app

## 🔍 Project Audit Report

### 1. Project Structure & Wiring
- **Backend (Django):** Root directory, serving API at `http://localhost:8000` (exposed as `192.168.3.183`).
- **Frontend (React Web):** Points to backend API correctly.
- **Mobile (React Native):** Also wired to backend API.
- **Authentication Flow:** JWT (access + refresh tokens) implemented with interceptors. ✅ Wiring confirmed correct.

### 2. Security Findings
- **Hardcoded Secrets:**  
  - `SECRET_KEY` and database password are directly in `settings.py`.  
- **Insecure Settings:**  
  - `DEBUG = True` and `ALLOWED_HOSTS = ['*']` — unsafe for production.  
- **No Environment Variables:**  
  - Values are hardcoded instead of using `os.getenv()`.  
- **Frontend/Mobile:**  
  - API URLs are hardcoded to a specific IP.  
- **Gitignore:**  
  - Node modules ignored, but backend lacks `.env` ignore (because `.env` not yet used).

### 3. Missing / Unused Files
- **Missing:**  
  - `requirements.txt` (or Pipfile) to document Python dependencies.  
- **Unused:**  
  - `api/tests.py` is empty.  
  - Standard boilerplate in `notes-frontend/src` (e.g., `setupTests.js`) if tests aren’t run.

### 4. Recommendations
- **Create `requirements.txt`:**  
  ```bash
  pip freeze > requirements.txt
  - Externalize Secrets:
- Move SECRET_KEY, DB credentials, and DEBUG status into .env.
- Use python-dotenv in settings.py.
- Configurable API URL:
- Use .env in frontend and mobile for API_BASE.
- Example: REACT_APP_API_BASE=http://192.168.3.183:8000/api.
- Cleanup:
- Remove unused boilerplate/test files.
- Update .gitignore to exclude .env.
⚠️ Note for Reviewers:
This project is configured for demo purposes. In production, secrets would be externalized, DEBUG disabled, and API URLs made configurable. The current setup prioritizes clarity and simplicity for demonstration

