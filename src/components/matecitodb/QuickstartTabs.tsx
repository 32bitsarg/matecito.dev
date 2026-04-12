"use client"

import { useState } from "react"

type Tab = "sdk" | "api"
type SDKVersion = "v1" | "v2"

const SDK_V1_CODE = `import { createClient } from 'matecitodb'

// Inicializá el cliente (v1)
const db = createClient(
  process.env.NEXT_PUBLIC_MATECITODB_URL,
  { apiKey: process.env.NEXT_PUBLIC_MATECITODB_ANON_KEY }
)

// Auth
const { user } = await db.auth.signIn(email, password)

// Consultá datos
const data = await db
  .collection('productos')
  .find({ activo: true })

// Insertá
await db.collection('pedidos').create({
  userId: user.id,
  total: 2800,
})`

const SDK_V2_CODE = `import { createClient } from 'matecitodb'

// Inicializá el cliente (v2)
const db = createClient(
  process.env.NEXT_PUBLIC_MATECITODB_URL,
  {
    apiKey: process.env.NEXT_PUBLIC_MATECITODB_ANON_KEY,
    apiVersion: 'v2',
  }
)

// Auth
const { user } = await db.auth.signIn(email, password)

// Consultá datos — nueva sintaxis v2
const data = await db
  .from('productos')
  .where('activo', '=', true)
  .get()

// Insertá
await db.from('pedidos').create({
  userId: user.id,
  total: 2800,
})`

const API_CODE = `# Base URL de tu proyecto
BASE=https://mi-proyecto.matecito.dev/api/v2/project

# Auth — obtener token
curl -X POST $BASE/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{ "email": "dev@ejemplo.com", "password": "••••••" }'

# → { "token": "eyJ...", "user": { "id": "usr_01", ... } }

# Consultar registros
curl "$BASE/data/productos?activo=true" \\
  -H "Authorization: Bearer eyJ..."

# → { "data": [...], "count": 12 }

# Insertar registro
curl -X POST $BASE/data/pedidos \\
  -H "Authorization: Bearer eyJ..." \\
  -H "Content-Type: application/json" \\
  -d '{ "userId": "usr_01", "total": 2800 }'

# → { "id": 42, "created_at": "2025-..." }`

type TokenLine = { text: string; color: string }

function colorizeSDK(code: string): TokenLine[][] {
    return code.split('\n').map(line => {
        const segments: TokenLine[] = []
        if (line.startsWith('//')) {
            segments.push({ text: line, color: '#64748b' })
        } else if (line.includes("'matecitodb'") || line.includes("'productos'") || line.includes("'activo'") || line.includes("'='") || line.includes("'pedidos'")) {
            // basic string highlight
            const parts = line.split(/(\'[^\']*\')/g)
            parts.forEach(p => {
                if (p.startsWith("'")) segments.push({ text: p, color: '#34d399' })
                else if (/\b(import|from|const|await|true|false)\b/.test(p)) {
                    // split further for keywords
                    const kw = p.split(/\b(import|from|const|await|true|false)\b/g)
                    kw.forEach(k => {
                        if (/^(import|from|const|await|true|false)$/.test(k)) segments.push({ text: k, color: '#7c3aed' })
                        else segments.push({ text: k, color: '#e2e8f0' })
                    })
                } else {
                    segments.push({ text: p, color: '#e2e8f0' })
                }
            })
        } else {
            const kw = line.split(/\b(import|from|const|await|true|false)\b/g)
            kw.forEach(k => {
                if (/^(import|from|const|await|true|false)$/.test(k)) segments.push({ text: k, color: '#7c3aed' })
                else if (k.includes("process.env")) {
                    const env = k.split(/(NEXT_PUBLIC_\w+)/g)
                    env.forEach(e => {
                        if (e.startsWith('NEXT_PUBLIC_')) segments.push({ text: e, color: '#34d399' })
                        else segments.push({ text: e, color: '#e2e8f0' })
                    })
                } else {
                    segments.push({ text: k, color: '#e2e8f0' })
                }
            })
        }
        return segments
    })
}

function colorizeAPI(code: string): TokenLine[][] {
    return code.split('\n').map(line => {
        if (line.startsWith('#')) return [{ text: line, color: '#64748b' }]
        if (line.startsWith('→')) return [{ text: line, color: '#6d9eeb' }]
        if (line.startsWith('BASE=')) return [
            { text: 'BASE=', color: '#94a3b8' },
            { text: line.slice(5), color: '#34d399' },
        ]
        // curl keyword
        if (line.trimStart().startsWith('curl')) {
            return [
                { text: line.match(/^\s*/)?.[0] ?? '', color: '#e2e8f0' },
                { text: 'curl', color: '#38bdf8' },
                { text: line.slice((line.match(/^\s*/)?.[0].length ?? 0) + 4), color: '#e2e8f0' },
            ]
        }
        return [{ text: line, color: '#e2e8f0' }]
    })
}

export function QuickstartTabs() {
    const [tab, setTab]         = useState<Tab>("sdk")
    const [sdkVersion, setSdkVersion] = useState<SDKVersion>("v2")

    const sdkCode  = sdkVersion === "v2" ? SDK_V2_CODE : SDK_V1_CODE
    const sdkLines = colorizeSDK(sdkCode)
    const apiLines = colorizeAPI(API_CODE)
    const lines    = tab === "sdk" ? sdkLines : apiLines

    return (
        <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor: '#0d0d0d', borderColor: 'rgba(255,255,255,0.10)' }}>
            {/* chrome + tabs */}
            <div className="flex items-center flex-wrap gap-y-2 px-5 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                {/* dots */}
                <div className="flex items-center gap-2 mr-6" aria-hidden="true">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>

                {/* main tabs */}
                {(["sdk", "api"] as Tab[]).map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className="px-4 py-1.5 text-xs font-mono rounded-lg transition-all mr-1"
                        style={{
                            backgroundColor: tab === t ? 'rgba(255,255,255,0.08)' : 'transparent',
                            color: tab === t ? '#f0f0f0' : 'rgba(240,240,240,0.35)',
                            border: tab === t ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
                        }}
                    >
                        {t === "sdk" ? "SDK (npm)" : "API REST"}
                    </button>
                ))}

                <div className="ml-auto flex items-center gap-2">
                    {/* SDK version toggle */}
                    {tab === "sdk" && (
                        <div className="flex items-center rounded-lg overflow-hidden border"
                            style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
                            {(["v1", "v2"] as SDKVersion[]).map(v => (
                                <button
                                    key={v}
                                    onClick={() => setSdkVersion(v)}
                                    className="px-3 py-1 text-[11px] font-mono transition-all"
                                    style={{
                                        backgroundColor: sdkVersion === v ? v === 'v2' ? 'rgba(109,0,26,0.40)' : 'rgba(255,255,255,0.07)' : 'transparent',
                                        color: sdkVersion === v ? v === 'v2' ? '#e0a0a0' : '#f0f0f0' : 'rgba(240,240,240,0.30)',
                                    }}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    )}

                    {tab === "api" && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded"
                            style={{ backgroundColor: 'rgba(109,0,26,0.25)', color: '#e0a0a0', border: '1px solid rgba(109,0,26,0.40)' }}>
                            cualquier lenguaje
                        </span>
                    )}
                </div>
            </div>

            {/* v1 deprecation notice */}
            {tab === "sdk" && sdkVersion === "v1" && (
                <div className="px-6 py-2.5 flex items-center gap-2 border-b text-xs font-mono"
                    style={{ backgroundColor: 'rgba(245,158,11,0.07)', borderColor: 'rgba(245,158,11,0.20)', color: 'rgba(245,158,11,0.80)' }}>
                    <span>⚠</span>
                    <span>v1 en mantenimiento. Migrá a v2 para acceder a nuevas features.</span>
                </div>
            )}

            {tab === "sdk" && sdkVersion === "v2" && (
                <div className="px-6 py-2.5 flex items-center gap-2 border-b text-xs font-mono"
                    style={{ backgroundColor: 'rgba(52,211,153,0.06)', borderColor: 'rgba(52,211,153,0.15)', color: 'rgba(52,211,153,0.75)' }}>
                    <span>✓</span>
                    <span>API v2 — recomendada. Mejor rendimiento, nuevas features y soporte activo.</span>
                </div>
            )}

            <pre className="p-6 text-sm font-mono leading-relaxed overflow-x-auto" aria-label={`Ejemplo ${tab === 'sdk' ? `SDK ${sdkVersion}` : 'API REST'} de matecitodb`}>
                <code>
                    {lines.map((lineTokens, li) => (
                        <span key={li}>
                            {lineTokens.map((tok, ti) => (
                                <span key={ti} style={{ color: tok.color }}>{tok.text}</span>
                            ))}
                            {li < lines.length - 1 && '\n'}
                        </span>
                    ))}
                </code>
            </pre>
        </div>
    )
}
