import asyncio
import sys
import logging
import os

# Set up logging to stdout
logging.basicConfig(level=logging.DEBUG, stream=sys.stdout)

# Add current dir to path to import local modules
sys.path.append(os.path.dirname(__file__))

if os.path.exists('.env'):
    with open('.env', 'r', encoding='utf-8') as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                k, v = line.strip().split('=', 1)
                os.environ[k] = v

from ai_service import get_faculty_response

async def main():
    print("Testing OpenRouter connection...")
    response = await get_faculty_response("ما هي أقسام كلية الحاسبات والمعلومات؟")
    print("RESPONSE:")
    print(response.encode('utf-8').decode('utf-8', 'ignore'))
    print("Raw Output:", repr(response))

if __name__ == "__main__":
    asyncio.run(main())
