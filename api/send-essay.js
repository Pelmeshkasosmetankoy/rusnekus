export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { topic, text } = req.body;

  if (!text || text.trim().length < 50) {
    return res.status(400).json({ error: "Сочинение слишком короткое." });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: "Бот не настроен." });
  }

  const wordCount = text.trim().split(/\s+/).length;
  const header = `📝 Новое сочинение\nТема: ${topic}\nСлов: ${wordCount}\n\n`;
  const fullMessage = header + text;

  // Telegram ограничивает сообщение 4096 символами — режем на части при необходимости
  const chunks = [];
  let remaining = fullMessage;
  while (remaining.length > 0) {
    chunks.push(remaining.slice(0, 4000));
    remaining = remaining.slice(4000);
  }

  try {
    for (const chunk of chunks) {
      const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: chunk }),
      });
      const data = await r.json();
      if (!data.ok) {
        return res.status(500).json({ error: "Telegram отклонил сообщение: " + (data.description || "неизвестная ошибка") });
      }
    }
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Ошибка отправки: " + e.message });
  }
}
