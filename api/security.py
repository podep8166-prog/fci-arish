from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address

# Initialize Rate Limiter based on IP Address
limiter = Limiter(key_func=get_remote_address)

async def security_headers_middleware(request: Request, call_next):
    """
    Middleware to inject standard security headers.
    """
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    return response
