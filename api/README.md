# FCI Arish Assistant Backend

This backend is built with **FastAPI** and uses **Pydantic** for strict data validation and security.

## IMPORTANT: Python Version Requirement
You MUST use **Python 3.11 or Python 3.12** to run this backend.
**Do NOT use Python 3.14** or cutting-edge pre-release versions. 
The core validation library (`pydantic-core`) requires a Rust compiler to build from source on unsupported Python versions. Using a stable version like 3.12 ensures that pre-built wheels are downloaded, making installation instantaneous.

## Setup Instructions

1. **Install Python 3.12**
   Make sure `python --version` outputs 3.12.x.

2. **Create a Virtual Environment**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables**
   Rename `.env.example` to `.env` and fill in your actual OpenRouter API key:
   ```env
   OPENROUTER_API_KEY=sk-or-v1-...
   OPENROUTER_MODEL=google/gemini-1.5-flash
   ENVIRONMENT=development
   ENABLE_DOCS=true
   ```

5. **Run the Server**
   ```bash
   uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```

## Security & Architecture
- **API Keys are Server-Side Only**: The frontend never sees the OpenRouter key.
- **Strict CORS**: Only requests from `ALLOWED_ORIGINS` are accepted.
- **Rate Limiting**: Protects against spam/DDoS via `slowapi`.
- **Error Handling**: The server translates provider errors (401, 429) into safe Arabic messages for the user, hiding technical stack traces.
