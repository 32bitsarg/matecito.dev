"use client"

import { useEffect, useState } from "react"

type Line = {
    text: string
    type: "comment" | "code" | "response" | "success" | "blank"
    delay: number
}

const LINES: Line[] = [
    { text: "// conectar al proyecto",           type: "comment",  delay: 0    },
    { text: "const db = createClient(PROJECT_URL, { apiKey })", type: "code", delay: 300 },
    { text: "",                                                  type: "blank", delay: 700 },
    { text: "// autenticar usuario",              type: "comment",  delay: 900  },
    { text: "const { user } = await db.auth.signIn(email, password)", type: "code", delay: 1200 },
    { text: '→ { id: "usr_01", email: "dev@ejemplo.com" }',     type: "response", delay: 1900 },
    { text: "",                                                  type: "blank", delay: 2300 },
    { text: "// traer registros",                 type: "comment",  delay: 2500 },
    { text: "const data = await db.from('productos')",          type: "code",    delay: 2800 },
    { text: "  .where('precio', '<', 5000).get()",              type: "code",    delay: 3100 },
    { text: '→ [{ id: 1, nombre: "Mate", precio: 2800 }, ...]', type: "response", delay: 3700 },
    { text: "",                                                  type: "blank", delay: 4100 },
    { text: "// insertar",                        type: "comment",  delay: 4300 },
    { text: "await db.from('pedidos').create({ userId: user.id, total: 2800 })", type: "code", delay: 4600 },
    { text: '→ { id: 42, created_at: "2025-…" }',              type: "response", delay: 5300 },
    { text: "",                                                  type: "blank", delay: 5600 },
    { text: "// ✓ listo para producción",         type: "success",  delay: 5900 },
]

export function DatabaseTerminal() {
    const [visible, setVisible] = useState<number[]>([])
    const [cursor, setCursor]   = useState(true)
    const [done, setDone]       = useState(false)

    useEffect(() => {
        const timers = LINES.map((l, i) =>
            setTimeout(() => setVisible(v => [...v, i]), l.delay)
        )
        const doneTimer = setTimeout(() => setDone(true), LINES[LINES.length - 1].delay + 600)
        const cursorTimer = setInterval(() => setCursor(c => !c), 530)
        return () => {
            timers.forEach(clearTimeout)
            clearTimeout(doneTimer)
            clearInterval(cursorTimer)
        }
    }, [])

    return (
        <div
            className="w-full rounded-2xl overflow-hidden font-mono text-[12.5px] border select-none"
            style={{ backgroundColor: '#0d0d0d', borderColor: 'rgba(255,255,255,0.10)', maxWidth: 500 }}
            aria-hidden="true"
        >
            {/* chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                <span className="ml-2 text-[11px]" style={{ color: 'rgba(240,240,240,0.25)' }}>db.ts</span>
            </div>

            <div className="px-5 py-5 space-y-[4px] min-h-[320px]">
                {LINES.map((line, i) => (
                    <div
                        key={i}
                        className="leading-relaxed transition-all duration-200 whitespace-pre"
                        style={{
                            opacity:   visible.includes(i) ? 1 : 0,
                            transform: visible.includes(i) ? 'translateY(0)' : 'translateY(3px)',
                            color:
                                line.type === "success"  ? '#34d399' :
                                line.type === "comment"  ? 'rgba(240,240,240,0.28)' :
                                line.type === "response" ? '#6d9eeb' :
                                'rgba(240,240,240,0.80)',
                            fontSize: line.type === "response" ? '11.5px' : undefined,
                        }}
                    >
                        {line.text || '\u00A0'}
                    </div>
                ))}
                {!done && (
                    <span
                        className="inline-block w-[7px] h-[13px] align-middle"
                        style={{ backgroundColor: '#6d001a', opacity: cursor ? 1 : 0, transition: 'opacity 0.1s' }}
                    />
                )}
            </div>
        </div>
    )
}
