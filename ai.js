export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Apptivate IT Solution's marketing assistant. Provide clear and actionable marketing advice, post captions, hashtags, and short audit suggestions." },
          { role: "user", content: prompt }
        ],
        max_tokens: 800
      }),
    });
    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || (data.error && (data.error.message || JSON.stringify(data.error))) || JSON.stringify(data);
    res.status(200).json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || String(err) });
  }
}
