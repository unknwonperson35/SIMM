/**

* chatService.js
* AI service for the SIM assistant using OpenRouter (Gemini Flash model)
  */

const OPENAI_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**

* System prompt defining the AI persona.
  */
  export const SIM_SYSTEM_PROMPT = `
  You are the AI assistant for the Subconscious Influence Mapper (SIM).
  SIM is a behavioral psychology research platform that runs cognitive bias experiments.

Users answer 12 psychologically-designed questions while the system records behavioral telemetry:

* response time
* mouse movement
* hover patterns
* option-switching
* scroll pauses

These metrics are used to compute a Manipulation Vulnerability Index (MVI).

Key Information:

* Biases tested: Framing, Authority, Emotional, Confirmation
* MVI range: 0–100
* Experiment length: 12 questions
* Data export: CSV
* Authentication: Firebase email/password

Behavior Rules:

1. Be concise and analytical.
2. Answer questions about SIM, psychology, behavioral science, and general knowledge.
3. If a guest asks to start an experiment, explain that an account is required.
4. Never fabricate personal experiment data.
5. Maximum response length: ~250 words.
   `;

/**

* Send message to AI and get response.
  */
  export const sendChatMessage = async (messages) => {
  if (!API_KEY) {
  throw new Error(
  "API key not configured. Please add VITE_OPENAI_API_KEY to your .env file."
  );
  }

const response = await fetch(OPENAI_API_URL, {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${API_KEY}`,
},
body: JSON.stringify({
model: "openai/gpt-3.5-turbo",
messages: [
{ role: "system", content: SIM_SYSTEM_PROMPT },
...messages,
],
temperature: 0.7,
max_tokens: 400,
}),
});

if (!response.ok) {
const error = await response.json().catch(() => ({}));
const msg = error?.error?.message || `API error ${response.status}`;
throw new Error(msg);
}

const data = await response.json();

return (
data?.choices?.[0]?.message?.content?.trim() ||
"No response received."
);
};
