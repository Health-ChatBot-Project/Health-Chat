exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("GROQ_API_KEY is not configured.");
    return jsonResponse(500, { error: "Chat service is not configured. Add GROQ_API_KEY in Netlify environment variables." });
  }

  let request;
  try {
    request = JSON.parse(event.body || "");
  } catch {
    return jsonResponse(400, { error: "Invalid request body." });
  }

  if (!Array.isArray(request.messages) || request.messages.length === 0) {
    return jsonResponse(400, { error: "A non-empty messages array is required." });
  }

  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: request.model || "openai/gpt-oss-20b",
        messages: request.messages,
      }),
    });

    const responseBody = await groqResponse.json();
    if (!groqResponse.ok) {
      console.error("Groq API request failed:", groqResponse.status, responseBody?.error?.message);
      return jsonResponse(groqResponse.status, {
        error: responseBody?.error?.message || `Groq request failed (HTTP ${groqResponse.status}).`,
      });
    }

    return jsonResponse(200, responseBody);
  } catch (error) {
    console.error("Unable to reach Groq API:", error);
    return jsonResponse(502, { error: "Unable to reach Groq. Please try again later." });
  }
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
