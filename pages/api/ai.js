
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { prompt } = req.body;

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
          { role: "system", content: "You are Apptivate IT Solution's AI marketing assistant." },
          { role: "user", content: prompt }
        ]
      }),
    });

    const data = await response.json();
    res.status(200).json({ text: data?.choices?.[0]?.message?.content || "No response" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
