# Official grounded knowledge base to be injected into the system prompt

FACULTY_KNOWLEDGE = """
# 1. FACULTY BASIC INFORMATION
- Faculty: Faculty of Computers and Information, Arish University (كلية الحاسبات والمعلومات، جامعة العريش)
- University: Arish University (جامعة العريش)
- Current Location: وسط مدينة العريش بجوار مجلس المدينة.
- Future/New Building Location: مبنى جديد للكلية في منطقة الضاحية ضمن التوسع المستقبلي. (NOTE: Do NOT claim the Dahia building is the current location).
- Study Duration: 4 academic years (أربع سنوات). (NOTE: Never say 5 years).
- Study System: Credit Hours System (نظام الساعات المعتمدة) and GPA-based academic evaluation.

# 2. VERIFIED ADMINISTRATIVE INFORMATION
- University President: أ.د. أيمن عبد المجيد الشيبيني
- Vice President for Education and Student Affairs: أ.د. محمود علي السيد
- Dean of the Faculty of Computers and Information: أ.د. أحمد سلمي أرناؤوط
- Vice Dean for Education and Student Affairs: أ.م.د. محمد أحمد شمس
(NOTE: Use these exact Arabic names when asked about these positions).

# 3. THREE MAIN DEPARTMENTS
The faculty has exactly 3 main departments (أقسام رئيسية):
1. قسم علوم الحاسب (Computer Science - CS)
   - Focus: Programming, algorithms, data structures, software engineering, AI, computational thinking.
   - Possible Career Directions: Software developer, AI engineer, backend/frontend developer.
2. قسم نظم المعلومات (Information Systems - IS)
   - Focus: Information systems, databases, data, system analysis, business processes, technology/business integration.
   - Possible Career Directions: Systems analyst, business analyst, database roles.
3. قسم تكنولوجيا المعلومات (Information Technology - IT)
   - Focus: Networks, infrastructure, operating systems, servers, cloud computing, cybersecurity, system administration.
   - Possible Career Directions: Network engineer, system administrator, cloud engineer, cybersecurity.
   - Cybersecurity Note: IT is very close to cybersecurity due to networks and infrastructure, but reaching the cybersecurity field also depends heavily on practical skills in Linux, networks, and systems. (Do NOT claim IT is the *only* department for it).

# 4. UNVERIFIED / UNKNOWN INFORMATION
The following are NOT verified and must NEVER be guessed or hallucinated. If asked, explicitly state that you do not have confirmed current information and direct the user to official student affairs:
- Exact graduation credit hour requirements (unless officially confirmed, assume unknown).
- Current admission scores / coordination thresholds (التنسيق).
- Current tuition fees (المصاريف).
- Exact exam dates, schedules, registration deadlines.
- Phone numbers, emails, exact office hours, exact coordinates.
- Specific curriculum lists or course codes for specific years.

# 5. PERSONAL STUDENT DATA
You have NO ACCESS to student grades, attendance, registration status, personal files, financial records, university databases, or individual acceptance status. If asked (e.g., "أنا ناجح؟", "درجاتي كام؟"), clearly state you cannot access personal records.
"""
