/* ===================================================================
   CHATBOT — API Integration & Premium UI
   =================================================================== */

const CHAT_HTML = `
<div class="chatbot" id="chatbot">
  <button class="chatbot__toggle" id="chatbotToggle" aria-label="مساعد الكلية">
    <i data-lucide="bot"></i>
  </button>
  <div class="chatbot__panel" id="chatbotPanel">
    <div class="chatbot__header">
      <div class="chatbot__header-info">
        <i data-lucide="bot" style="color: var(--blue-300); width: 28px; height: 28px;"></i>
        <div>
          <strong>دليل الكلية الرقمي</strong>
          <small>اكتشف أقسام الكلية ومسارات الدراسة</small>
        </div>
      </div>
      <button class="chatbot__close" id="chatbotClose" aria-label="إغلاق"><i data-lucide="x"></i></button>
    </div>
    <div class="chatbot__body" id="chatbotBody">
      <div class="chatbot__msg chatbot__msg--bot">
        أهلاً بك. أنا دليلك للتعرف على كلية الحاسبات والمعلومات بجامعة العريش ومساراتها الأكاديمية. كيف يمكنني مساعدتك اليوم؟
      </div>
      <div class="chatbot__quick" id="chatbotQuick">
        <button class="chatbot__quick-btn">ما هي الأقسام؟</button>
        <button class="chatbot__quick-btn">الفرق بين CS و IS و IT</button>
        <button class="chatbot__quick-btn">ما الذي يميز الكلية؟</button>
        <button class="chatbot__quick-btn">كيف أصل إلى الكلية؟</button>
      </div>
    </div>
    <form class="chatbot__form" id="chatbotForm">
      <input type="text" id="chatbotInput" placeholder="اكتب سؤالك هنا..." required autocomplete="off">
      <button type="submit" aria-label="إرسال"><i data-lucide="send"></i></button>
    </form>
  </div>
</div>
`;



document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML('beforeend', CHAT_HTML);
  if (window.lucide) window.lucide.createIcons();

  const toggleBtn = document.getElementById("chatbotToggle");
  const closeBtn = document.getElementById("chatbotClose");
  const panel = document.getElementById("chatbotPanel");
  const form = document.getElementById("chatbotForm");
  const input = document.getElementById("chatbotInput");
  const body = document.getElementById("chatbotBody");
  const quickBox = document.getElementById("chatbotQuick");

  let isOpen = false;
  let conversationHistory = [];

  toggleBtn.addEventListener("click", () => {
    isOpen = !isOpen;
    if (isOpen) {
      panel.classList.add("is-open");
      input.focus();
    } else {
      panel.classList.remove("is-open");
    }
  });

  closeBtn.addEventListener("click", () => {
    isOpen = false;
    panel.classList.remove("is-open");
  });

  document.querySelectorAll(".chatbot__quick-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      input.value = btn.textContent;
      quickBox.style.display = 'none';
      form.dispatchEvent(new Event("submit"));
    });
  });

  function addMessage(text, isUser = false, isError = false) {
    const msg = document.createElement("div");
    msg.className = `chatbot__msg chatbot__msg--${isUser ? "user" : "bot"}`;
    if (isError) {
      msg.classList.add("chatbot__msg--error");
    }
    msg.textContent = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  function addLoading() {
    const msg = document.createElement("div");
    msg.className = 'chatbot__msg chatbot__msg--bot chatbot__msg--loading';
    msg.id = "chatbotLoading";
    msg.innerHTML = "<span style='font-size: 0.85rem; color: var(--navy-500); margin-inline-end: 8px;'>جاري التفكير...</span><span></span><span></span><span></span>";
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  function removeLoading() {
    const el = document.getElementById("chatbotLoading");
    if (el) el.remove();
  }

  async function fetchAnswer(question, history) {
    try {
      const response = await fetch(`/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: question, history: history })
      });
      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMsg = errorData.error;
          }
        } catch (parseError) {
           console.error("Could not parse error JSON:", parseError);
        }
        console.error("Backend Error Details:", errorMsg);
        
        if (response.status === 429) {
          throw new Error("429");
        }
        throw new Error(errorMsg);
      }
      const data = await response.json();
      return data.response;
    } catch (e) {
      throw e;
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    
    addMessage(text, true);
    input.value = "";
    quickBox.style.display = 'none';
    
    addLoading();
    
    input.disabled = true;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      const reply = await fetchAnswer(text, conversationHistory);
      removeLoading();
      addMessage(reply, false);
      
      // Update history defensively
      conversationHistory.push({ role: 'user', content: text });
      conversationHistory.push({ role: 'assistant', content: reply });
      if (conversationHistory.length > 6) {
        conversationHistory = conversationHistory.slice(-6);
      }
    } catch (e) {
      removeLoading();
      console.error("Chatbot Fetch Exception:", e);
      if (e.message === "429") {
        addMessage("عذراً، تم تجاوز الحد المسموح من الأسئلة. الرجاء الانتظار قليلاً.", false, true);
      } else if (e.message.includes("Failed to fetch") || e.name === "TypeError") {
        addMessage("عذراً، حدث خطأ في الاتصال بالخادم. تأكد من اتصالك بالإنترنت.", false, true);
      } else {
        addMessage(`خطأ تقني: ${e.message}`, false, true);
      }
    } finally {
      input.disabled = false;
      if (submitBtn) submitBtn.disabled = false;
      input.focus();
    }
  });
});
