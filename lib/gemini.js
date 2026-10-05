const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

async function generate(body) {
  if (!process.env.GEMINI_API_KEY) throw new Error("Gemini API key is missing.");
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini could not generate content (${response.status}): ${details.slice(0, 180)}`);
  }
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.find((part) => part.text)?.text;
  if (!text) throw new Error("Gemini returned an empty response.");
  return text.trim();
}

export async function describeImage({ buffer, mimeType, context, zone }) {
  const prompt = [
    "Describe this image accurately in 2 concise sentences for a humor-writing prompt.",
    "State only what is visually supported. Mention the people, action, setting, objects, and mood.",
    "Do not invent identities, names, or sensitive attributes.",
    `Campus zone supplied by the uploader: ${zone}.`,
    context ? `Uploader context: ${context}` : "The uploader provided no extra context.",
  ].join("\n");
  const description = await generate({
    contents: [{ role: "user", parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: buffer.toString("base64") } }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 220 },
  });
  return { description, prompt, model: MODEL };
}

export async function writeCaptions({ description, context, zone, tone }) {
  const prompt = [
    "You are writing original, human-sounding captions for Campus Survival Map.",
    "The audience persona is Sam: a chronically online Columbia junior from the Midwest who lives in the dorms and explores New York on weekends.",
    `Image description: ${description}`,
    `Campus zone: ${zone}`,
    context ? `Uploader context: ${context}` : "No uploader context was provided.",
    `Requested humor style: ${tone}.`,
    "Write exactly 4 distinct captions. Make them short, specific, relatable, and grounded in the image.",
    "Use natural student language. Avoid hashtags, quotation marks, emojis, explanations, generic meme filler, and invented claims that conflict with the image.",
    "Return JSON with one key named captions containing an array of 4 strings.",
  ].join("\n");
  const raw = await generate({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 1.05,
      maxOutputTokens: 500,
      responseMimeType: "application/json",
      responseSchema: { type: "OBJECT", properties: { captions: { type: "ARRAY", items: { type: "STRING" }, minItems: 4, maxItems: 4 } }, required: ["captions"] },
    },
  });
  let parsed;
  try { parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, "")); } catch { throw new Error("Gemini returned captions in an unexpected format."); }
  const captions = [...new Set((parsed.captions || []).map((item) => String(item).trim()).filter(Boolean))].slice(0, 4);
  if (captions.length !== 4) throw new Error("Gemini did not return four distinct captions.");
  return { captions, prompt, model: MODEL };
}
