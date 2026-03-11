export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Yalnızca POST' });

  try {
    const { data } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const promptText = `Sen profesyonel bir İK uzmanısın. 
    İsim: ${data.name}, Meslek: ${data.position}, Yetenekler: ${data.skills}, Deneyim: ${data.achievements}.
    Bunları kullanarak etkileyici bir CV özeti ve iş başarıları yaz. 
    Lütfen sadece HTML formatında cevap ver (div ve br etiketleri kullanarak).`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });

    const result = await response.json();
    const aiText = result.candidates[0].content.parts[0].text;
    return res.status(200).json({ text: aiText });

  } catch (error) {
    return res.status(500).json({ error: 'AI Motoru Başlatılamadı.' });
  }
}
