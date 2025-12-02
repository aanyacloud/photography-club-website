exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body || "{}");

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No message provided" }),
      };
    }

    const API_KEY = process.env.GEMINI_API_KEY;

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      API_KEY;

    const systemPrompt = `
You are P-Club Assistant — the official AI helper for a Photography & Tech Club website.
You help with gallery, events, workshops, membership, feedback, login issues, and general photography questions.
Keep replies short, friendly, and helpful.
If user asks unrelated questions, gently redirect back.
`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: systemPrompt + "\n\nUser: " + message,
            },
          ],
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't understand that.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error: " + err.message }),
    };
  }
};
