import logging
import json
import urllib.request
import urllib.error
from api.prompts import SYSTEM_PROMPT
from api.config import settings
from api.model_manager import model_manager
from api.faq_service import get_faq_answer

logger = logging.getLogger(__name__)

def get_faculty_response(user_message: str, history: list = None) -> str:
    """
    Checks FAQ first, then sends message to OpenRouter.
    Uses ModelManager for rotation and fallback.
    """
    # 1. FAQ / Knowledge Caching Layer
    faq_match = get_faq_answer(user_message)
    if faq_match:
        logger.info("Answered from FAQ Cache.")
        return faq_match

    # 2. AI Layer
    if not settings.OPENROUTER_API_KEY:
        logger.error("OPENROUTER_API_KEY is missing in environment variables.")
        return "تعذر الاتصال بالخدمة حالياً. الرجاء المحاولة في وقت لاحق."

    url = "https://openrouter.ai/api/v1/chat/completions"
    
    # Try models in rotation: max 2 attempts per request
    max_retries = 2
    for attempt in range(max_retries):
        current_model = model_manager.get_current_model()
        logger.info(f"Attempting OpenRouter with model: {current_model}")
        
        headers = {
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://aru.edu.eg",
            "X-Title": "FCI Arish Assistant"
        }
        
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        # Defensively inject history (last 4 messages max to save tokens)
        if history and isinstance(history, list):
            for msg in history[-4:]:
                if isinstance(msg, dict) and msg.get('role') in ['user', 'assistant'] and msg.get('content'):
                    messages.append({"role": msg['role'], "content": str(msg['content'])})
                    
        messages.append({"role": "user", "content": user_message})

        payload = {
            "model": current_model,
            "messages": messages,
            "temperature": 0.15,
            "max_tokens": 250
        }
        
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers=headers, method='POST')
        
        try:
            with urllib.request.urlopen(req, timeout=15.0) as response:
                response_body = response.read()
                response_data = json.loads(response_body.decode('utf-8'))
                reply = response_data.get("choices", [{}])[0].get("message", {}).get("content", "")
                
                if not reply:
                    logger.error(f"Empty response from model {current_model}")
                    model_manager.fallback_to_next_model()
                    continue
                    
                # Success! Increment request count.
                model_manager.increment_and_check_rotation()
                return reply.strip()
                
        except urllib.error.HTTPError as e:
            error_msg = e.read().decode('utf-8')
            logger.error(f"OpenRouter HTTP Error {e.code} with {current_model}: {error_msg}")
            
            # If rate limited, overloaded, or not found -> Fallback
            if e.code in [404, 408, 429, 500, 502, 503, 504]:
                model_manager.fallback_to_next_model()
                continue
            elif e.code in [401, 403]:
                logger.error("Authentication failed. Check API key.")
                return "تعذر التحقق من خدمة الذكاء الاصطناعي."
            else:
                model_manager.fallback_to_next_model()
                continue
                
        except urllib.error.URLError as e:
            logger.error(f"Network error with model {current_model}: {str(e)}")
            model_manager.fallback_to_next_model()
            continue
            
        except Exception as e:
            logger.error(f"Unexpected error with model {current_model}: {str(e)}")
            model_manager.fallback_to_next_model()
            continue

    # If all models failed
    logger.error("All AI models failed.")
    return "الخدمة الذكية مشغولة حالياً، حاول مرة أخرى بعد قليل."
