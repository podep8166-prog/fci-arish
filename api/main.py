import logging
import uuid
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from config import settings
from ai_service import get_faculty_response

# Configure secure structured logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - [%(name)s] - %(message)s")
logger = logging.getLogger("fci_backend")

app = Flask(__name__)

# Apply strict CORS - Allow all origins for Vercel serverless to avoid CORS blocking
CORS(app, resources={r"/*": {"origins": "*"}}, methods=["GET", "POST", "OPTIONS"])

# Apply rate limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=[settings.USER_RATE_LIMIT],
    storage_uri="memory://"
)

@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": "تم تجاوز الحد المسموح من الطلبات. يرجى الانتظار قليلاً."}), 429

@app.before_request
def add_request_id_and_log():
    if request.method == 'OPTIONS':
        return
    request.environ['REQ_ID'] = str(uuid.uuid4())
    request.environ['START_TIME'] = time.time()
    logger.info(f"Request {request.environ['REQ_ID']} started: {request.method} {request.path} from {request.remote_addr}")

@app.after_request
def apply_security_headers_and_log(response):
    # Security headers
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Content-Security-Policy'] = "default-src 'self'"
    response.headers['Cache-Control'] = 'no-store, max-age=0'
    
    if 'REQ_ID' in request.environ:
        process_time = time.time() - request.environ['START_TIME']
        response.headers['X-Request-ID'] = request.environ['REQ_ID']
        logger.info(f"Request {request.environ['REQ_ID']} finished: status {response.status_code} in {process_time:.3f}s")
    return response

@app.route('/health', methods=['GET'])
@limiter.exempt
def health_check():
    return jsonify({"status": "healthy", "version": "1.0", "ai_ready": bool(settings.OPENROUTER_API_KEY)})

@app.route('/api/ping', methods=['GET'])
@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"status": "Backend is alive and running on Vercel!"}), 200

@app.route('/api/chat', methods=['POST'])
@app.route('/chat', methods=['POST'])
@app.route('/api/main.py', methods=['POST'])
@app.route('/', defaults={'path': ''}, methods=['POST', 'GET'])
@app.route('/<path:path>', methods=['POST', 'GET'])
def chat_endpoint(path=''):
    if request.method == 'GET':
        return jsonify({"status": "healthy", "version": "1.0", "ai_ready": bool(settings.OPENROUTER_API_KEY)})
        
    import os
    if not os.environ.get('OPENROUTER_API_KEY'):
        return jsonify({"error": "API Key is missing in environment"}), 500

    try:
        data = request.get_json(silent=True)
        if not data or 'message' not in data:
            return jsonify({"error": "رسالة غير صالحة"}), 400
            
        user_message = data['message']
        history = data.get('history', [])
        
        if not isinstance(user_message, str) or len(user_message.strip()) == 0:
            return jsonify({"error": "الرسالة لا يمكن أن تكون فارغة"}), 400
            
        if len(user_message) > settings.MAX_MESSAGE_LENGTH:
            return jsonify({"error": f"الرسالة طويلة جداً. الحد الأقصى هو {settings.MAX_MESSAGE_LENGTH} حرف."}), 400

        reply = get_faculty_response(user_message, history)
        return jsonify({"response": reply})
    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=False)
