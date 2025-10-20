import { NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY

export async function POST(req: Request) {
  try {
    const { messages } = await req.json() as { messages: { role: string; content: string }[] }
    const system = `You are a helpful store assistant for a menswear shop called Léon Atelier.
Answer succinctly about products, sizing, materials, shipping and returns.
If you don't know, say you don't know and suggest visiting /products or contacting support.`

    // 1) Try Gemini first if configured
    if (GEMINI_KEY) {
      try {
        const lastUser = messages?.slice().reverse().find(m => m.role === 'user')?.content || ''
        const body = {
          contents: [
            { role: 'user', parts: [{ text: `${system}\n\nUser: ${lastUser}\nAssistant:` }] }
          ]
        }
        const models = [
          'gemini-2.5-flash',
          'gemini-2.5-pro',
          'gemini-2.0-flash',
        ]
        for (const m of models) {
          let ok = false
          for (let attempt = 0; attempt < 2; attempt++) {
            const url = `https://generativelanguage.googleapis.com/v1/models/${m}:generateContent?key=${encodeURIComponent(GEMINI_KEY)}`
            const r = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
              cache: 'no-store',
            })
            if (r.ok) {
              const data: any = await r.json().catch(() => null)
              const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
              if (text.trim()) return NextResponse.json({ reply: text.trim(), diag: `(model=${m}, status=200)` })
              ok = true
              break
            }
            await new Promise(res => setTimeout(res, 800))
          }
          if (ok) break
        }
      } catch { /* proceed to FAQ */ }
    }

    // 2) Fallback to local FAQ if no key or provider fails
    const lastUser = messages?.slice().reverse().find(m => m.role === 'user')?.content?.toLowerCase() || ''
    let faq = ''
    if (/return|refund/.test(lastUser)) {
      faq = 'We offer 30-day returns and free exchanges. Items must be unworn with tags. Start a return from your order email or contact support.'
    } else if (/ship|delivery|international|days|when/.test(lastUser)) {
      faq = 'We ship within 1–2 business days. Standard delivery takes 3–6 business days. International shipping is available at checkout.'
    } else if (/size|fit|measure|guide/.test(lastUser)) {
      faq = 'Most styles are true-to-size. See the Size guide on each product page. If between sizes, we suggest the larger size for tailored pieces.'
    } else if (/material|fabric|wool|leather|cotton/.test(lastUser)) {
      faq = 'We focus on natural and durable materials like wool, cotton, and leather. Product pages list exact composition and care.'
    } else if (/stock|available|restock|sold out/.test(lastUser)) {
      faq = 'If an item is out of stock, you can like it to get updates. Many core styles restock within 2–4 weeks.'
    } else if (/contact|support|help/.test(lastUser)) {
      faq = 'You can reach support via this chat or email us at support@leon-atelier.example. We reply within 24 hours.'
    } else {
      faq = 'How can I help? I can answer about returns (30 days), shipping (3–6 days), sizing, and materials. For product availability, tell me the product name.'
    }
    return NextResponse.json({ reply: faq, diag: '(model=faq, status=200)' })
  } catch {
    return NextResponse.json({ reply: 'Sorry, something went wrong. Please try again.', diag: '(model=error, status=500)' })
  }
}
