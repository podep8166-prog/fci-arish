import urllib.request
import json
import sys

# Force console to support utf-8 output properly if possible
sys.stdout.reconfigure(encoding='utf-8')

url = 'http://127.0.0.1:8000/api/chat'
headers = {'Content-Type': 'application/json'}

def send_msg(msg):
    data = json.dumps({"message": msg}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers=headers)
    try:
        with urllib.request.urlopen(req) as res:
            print(json.loads(res.read().decode('utf-8'))['response'])
    except Exception as e:
        print(f"Error: {e}")

print("=== Q1 ===")
send_msg("ما هي أقسام كلية الحاسبات والمعلومات بالعريش؟")
print("\n=== Q2 ===")
send_msg("ما الفرق بين علوم الحاسب ونظم المعلومات وتكنولوجيا المعلومات؟")
