'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type Msg = { role: 'user' | 'assistant'; content: string }

export default function SupportChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content:
        'Hi! I’m your store assistant. Ask me anything about products, sizing, shipping, or returns.',
    },
  ])
  const boxRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading])

  async function send() {
    if (!canSend) return
    const userMsg: Msg = { role: 'user', content: input.trim() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      const reply: string = data.reply || 'Sorry, I couldn’t get a response right now.'
      setMessages((m) => [...m, { role: 'assistant', content: reply }])
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="fixed right-4 bottom-24 md:bottom-4 z-40">
      {open && (
        <div className="mb-3 w-[92vw] max-w-sm rounded-2xl border border-sand bg-cream shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-sand">
            <div className="text-brownDark font-medium">Support</div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full px-2 py-1 text-brown hover:bg-sand/40"
            >
              ×
            </button>
          </div>
          <div ref={boxRef} className="px-3 py-3 max-h-80 overflow-auto space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              >
                <div
                  className={
                    m.role === 'user'
                      ? 'max-w-[85%] rounded-2xl px-3 py-2 bg-brown text-cream'
                      : 'max-w-[85%] rounded-2xl px-3 py-2 bg-cream border border-sand text-brownDark'
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-sand">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about our store..."
                className="flex-1 rounded-xl border border-sand bg-cream px-3 py-2 text-brownDark placeholder-brown/60 focus:outline-none focus:ring-2 focus:ring-gold/60"
              />
              <button
                onClick={send}
                disabled={!canSend}
                className={`rounded-xl px-4 py-2 transition ${canSend ? 'bg-brown text-cream hover:bg-brown/90' : 'bg-sand text-brown/60 cursor-not-allowed'}`}
              >
                {loading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open support chat"
        className="h-12 w-12 rounded-full bg-brown text-cream shadow-lg flex items-center justify-center hover:bg-brown/90 border border-sand"
      >
        ?
      </button>
    </div>
  )
}
