"use client"

import { useEffect, useState } from "react"

const LINES: { text: string; indent?: boolean; dimmed?: boolean; green?: boolean; delay: number }[] = [
    { text: "// matecito.dev",              dimmed: true,  delay: 0    },
    { text: "",                                             delay: 400  },
    { text: "const studio = {",                            delay: 600  },
    { text: "  baas:    'matecitodb',",      indent: true,  delay: 1000 },
    { text: "  apps:    ['web', 'games'],",  indent: true,  delay: 1500 },
    { text: "  clients: 'pymes + devs',",   indent: true,  delay: 2000 },
    { text: "  origin:  'Pergamino, AR',",  indent: true,  delay: 2500 },
    { text: "}",                                            delay: 2900 },
    { text: "",                                             delay: 3200 },
    { text: "await studio.build()",                        delay: 3500 },
    { text: "// ✓ ready",                   green: true,   delay: 4200 },
]

export function TerminalAnimation() {
    const [visible, setVisible] = useState<number[]>([])
    const [cursor, setCursor]   = useState(true)

    useEffect(() => {
        const timers = LINES.map((l, i) =>
            setTimeout(() => setVisible(v => [...v, i]), l.delay)
        )
        const cursorTimer = setInterval(() => setCursor(c => !c), 530)
        return () => { timers.forEach(clearTimeout); clearInterval(cursorTimer) }
    }, [])

    return (
        <div
            className="w-full max-w-xs mx-auto rounded-2xl overflow-hidden font-mono text-[13px] border select-none"
            style={{ backgroundColor: '#0d0d0d', borderColor: 'rgba(255,255,255,0.10)' }}
            aria-hidden="true"
        >
            {/* chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                <span className="ml-2 text-[11px]" style={{ color: 'rgba(240,240,240,0.25)' }}>index.ts</span>
            </div>

            <div className="px-5 py-5 space-y-[3px] min-h-[240px]">
                {LINES.map((line, i) => (
                    <div
                        key={i}
                        className="leading-relaxed transition-all duration-200 whitespace-pre"
                        style={{
                            opacity:    visible.includes(i) ? 1 : 0,
                            transform:  visible.includes(i) ? 'translateY(0)' : 'translateY(3px)',
                            color: line.green   ? '#34d399'
                                 : line.dimmed  ? 'rgba(240,240,240,0.28)'
                                 : line.indent  ? 'rgba(240,240,240,0.55)'
                                 : 'rgba(240,240,240,0.80)',
                        }}
                    >
                        {line.text || '\u00A0'}
                    </div>
                ))}
                <span
                    className="inline-block w-[7px] h-[14px] align-middle mt-1"
                    style={{ backgroundColor: '#6d001a', opacity: cursor ? 1 : 0, transition: 'opacity 0.1s' }}
                />
            </div>
        </div>
    )
}
