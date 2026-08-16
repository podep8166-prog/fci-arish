import urllib.request
import json
import time
import sys
sys.stdout.reconfigure(encoding='utf-8')

URL = "http://127.0.0.1:8000/api/chat"

tests = [
    "الكلية كام سنة؟",
    "فيها كام قسم؟",
    "ايه الأقسام؟",
    "الكلية فين؟",
    "المبنى الجديد فين؟",
    "مين العميد؟",
    "مين رئيس الجامعة؟",
    "مين نائب رئيس الجامعة لشئون الطلاب؟",
    "مين وكيل الكلية لشئون الطلاب؟",
    "CS ولا IT للسايبر؟",
    "المصاريف كام؟",
    "أنا ناجح؟",
    "اشرحلي Python عشان أنا في حاسبات.",
    "احكيلي نكتة.",
]

def make_req(q, hist=None):
    data = json.dumps({"message": q, "history": hist or []}).encode('utf-8')
    req = urllib.request.Request(URL, data=data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8')).get('response', '')
    except Exception as e:
        return str(e)

print("--- RUNNING TESTS ---")
for t in tests:
    print(f"\nQ: {t}")
    start = time.time()
    ans = make_req(t)
    print(f"A: {ans}")
    print(f"Latency: {time.time() - start:.2f}s")

# Test 15: History context
print("\n--- TEST: HISTORY CONTEXT ---")
history = []
q1 = "الكلية كام سنة؟"
print(f"Q1: {q1}")
r1 = make_req(q1, history)
print(f"A1: {r1}")
history.extend([{"role": "user", "content": q1}, {"role": "assistant", "content": r1}])

q2 = "طب وأقسامها؟"
print(f"Q2: {q2}")
r2 = make_req(q2, history)
print(f"A2: {r2}")
