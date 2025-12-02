console.log("Chatbot JS LOADED!");
window.CHATBOT_LOADED = true;
export function initChatbotUI(askAI) {
    const toggle = document.getElementById("chatbot-toggle");
    const panel = document.getElementById("chatbot-panel");
    const closeBtn = document.getElementById("chatbot-close");
    const sendBtn = document.getElementById("chatbot-send");
    const input = document.getElementById("chatbot-input");
    const messages = document.getElementById("chatbot-messages");

    toggle.addEventListener("click", () => panel.classList.add("open"));
    closeBtn.addEventListener("click", () => panel.classList.remove("open"));

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        messages.innerHTML += `<div class="msg user">${text}</div>`;
        input.value = "";

        const reply = await askAI(text);

        messages.innerHTML += `<div class="msg bot">${reply}</div>`;
        messages.scrollTop = messages.scrollHeight;
    }

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    document.querySelectorAll(".chat-quick-option").forEach(btn => {
        btn.addEventListener("click", () => {
            input.value = btn.dataset.question;
            sendMessage();
        });
    });
}
