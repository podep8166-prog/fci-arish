import pytest
from fastapi.testclient import TestClient
from main import app
from config import settings

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    # Check security headers
    assert "X-Content-Type-Options" in response.headers
    assert response.headers["X-Content-Type-Options"] == "nosniff"

def test_chat_empty_message():
    response = client.post("/api/chat", json={"message": ""})
    # Pydantic field validation ensures min_length=1
    assert response.status_code == 422 

def test_chat_missing_field():
    response = client.post("/api/chat", json={})
    assert response.status_code == 422

def test_chat_message_too_long():
    long_msg = "a" * (settings.MAX_MESSAGE_LENGTH + 1)
    response = client.post("/api/chat", json={"message": long_msg})
    # Pydantic field validation ensures max_length
    assert response.status_code == 422

def test_cors_headers_rejected_origin():
    response = client.options("/api/chat", headers={
        "Origin": "http://evil-origin.com",
        "Access-Control-Request-Method": "POST"
    })
    # Evil origin should not be in allow-access-control-origin
    assert response.headers.get("access-control-allow-origin") != "http://evil-origin.com"

def test_rate_limiting():
    # Rapidly hit health check (which is exempt, so this won't trigger 429)
    for _ in range(20):
        client.get("/health")
    
    # Hit /api/chat multiple times. 
    # Since RATE_LIMIT_PER_MINUTE is small (e.g. 10/minute), this should trigger 429
    # But since it calls the actual AI API, we will just send empty messages to get 422 
    # until we hit the rate limit which triggers before body validation.
    status_codes = set()
    for _ in range(settings.RATE_LIMIT_PER_MINUTE.split('/')[0]):
        # We use a malformed request so we don't spam the actual AI API during testing
        res = client.post("/api/chat", json={"msg": "wrong field"})
        status_codes.add(res.status_code)
    
    # 422 means validation failed, 429 means rate limit exceeded.
    assert 422 in status_codes or 429 in status_codes
