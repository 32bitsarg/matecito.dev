import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Database, Lock, HardDrive, Zap, Shield, Terminal, MapPin, Package } from 'lucide-react'
import NewsletterForm from '@/components/newsletter/NewsletterForm'

function getSdkVersion(): string {
    try {
        const pkgPath = path.resolve(process.cwd(), '..', 'matecitosdk', 'matecitodb', 'package.json')
        return JSON.parse(fs.readFileSync(pkgPath, 'utf-8')).version
    } catch {
        return process.env.SDK_VERSION ?? '2.0.0'
    }
}

export const metadata = {
    title: 'matecitodb — BaaS para desarrolladores argentinos | matecito.dev',
    description: 'SDK oficial de matecito.dev. Auth, queries en tiempo real, storage y más. Instalá con npm y conectá tu app en minutos.',
    keywords: ['BaaS Argentina', 'backend as a service', 'SDK JavaScript', 'matecitodb', 'base de datos tiempo real', 'auth sdk'],
    openGraph: {
        title: 'matecitodb — BaaS para desarrolladores argentinos',
        description: 'Auth, queries, storage y realtime. Todo en un SDK, listo para tu proyecto.',
        url: 'https://matecito.dev/matecitodb',
        siteName: 'matecito.dev',
        locale: 'es_AR',
        type: 'website',
    },
}

const features = [
    {
        icon: Lock,
        color: 'bg-violet-50 text-violet-600',
        title: 'Auth completo',
        desc: 'Login, registro, JWT, reset de contraseña. Todo listo sin configurar nada extra.',
        items: ['Registro y login', 'Tokens JWT', 'Reset de contraseña', 'Sesiones persistentes'],
    },
    {
        icon: Database,
        color: 'bg-blue-50 text-blue-600',
        title: 'Queries en tiempo real',
        desc: 'Filtrá, paginá y ordená tus datos con una API limpia y predecible.',
        items: ['Filtros avanzados', 'Paginación', 'Ordenamiento', 'Selección de campos'],
    },
    {
        icon: HardDrive,
        color: 'bg-emerald-50 text-emerald-600',
        title: 'Storage',
        desc: 'Subí archivos e imágenes y generá URLs firmadas para acceso controlado.',
        items: ['Subida de archivos', 'Imágenes optimizadas', 'URLs firmadas', 'Control de acceso'],
    },
    {
        icon: Zap,
        color: 'bg-amber-50 text-amber-600',
        title: 'Batch operations',
        desc: 'Ejecutá hasta 50 operaciones en un solo request. Eficiente y rápido.',
        items: ['Hasta 50 ops/request', 'Transaccional', 'Rollback automático', 'Menor latencia'],
    },
    {
        icon: Shield,
        color: 'bg-rose-50 text-rose-600',
        title: 'Permisos granulares',
        desc: 'Controlá el acceso con roles: auth, public, service y nobody.',
        items: ['Rol auth', 'Rol public', 'Rol service', 'Rol nobody'],
    },
    {
        icon: Terminal,
        color: 'bg-teal-50 text-teal-600',
        title: 'CLI incluida',
        desc: 'Creá colecciones, migrá datos y configurá tu proyecto desde la terminal.',
        items: ['Crear colecciones', 'Migrar datos', 'Gestión de proyectos', 'Deploy helpers'],
    },
]

export default function MatecitoDB() {
    const sdkVersion = getSdkVersion()

    return (
        <div className="flex flex-col bg-white">

            {/* ── HERO ─────────────────────────────────────────── */}
            <section className="relative overflow-hidden py-28 px-6">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#7c3aed08_1px,transparent_1px),linear-gradient(to_bottom,#7c3aed08_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-violet-100 rounded-full blur-[120px] opacity-50" />

                <div className="relative max-w-4xl mx-auto text-center space-y-8">
                    {/* npm badge + version */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-medium"
                            style={{ background: '#0f172a', color: '#e2e8f0' }}>
                            <Package className="w-3.5 h-3.5" style={{ color: '#a78bfa' }} />
                            npm install matecitodb
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-full text-violet-700 text-xs font-semibold">
                            v{sdkVersion}
                        </span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
                        El BaaS que querías.<br />
                        <span className="text-violet-600">Sin sorpresas.</span>
                    </h1>

                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Auth, queries, storage y realtime. Todo en un SDK, listo para tu proyecto.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                        <a href="#newsletter"
                            className="flex items-center gap-2 px-8 py-4 bg-violet-600 text-white font-bold text-sm rounded-xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-200">
                            Anotarme al lanzamiento
                            <ArrowRight className="w-4 h-4" />
                        </a>
                        <Link href="/docs"
                            className="flex items-center gap-2 px-8 py-4 bg-white text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
                            Ver documentación
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FEATURES GRID ────────────────────────────────── */}
            <section className="py-24 px-6 bg-slate-50 border-y border-slate-200">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 space-y-3">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Qué incluye</p>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            Todo lo que necesitás, nada más
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            Un SDK que cubre el 90% de lo que necesita una app moderna. Sin configurar mil servicios separados.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map(f => (
                            <div key={f.title}
                                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-violet-300 hover:shadow-md transition-all">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.color}`}>
                                    <f.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                                </div>
                                <ul className="space-y-1.5">
                                    {f.items.map(item => (
                                        <li key={item} className="flex items-center gap-2 text-xs text-slate-500">
                                            <CheckCircle className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CODE SNIPPET ─────────────────────────────────── */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12 space-y-3">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Así de simple</p>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            De npm install a producción en minutos
                        </h2>
                    </div>

                    <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-800">
                        {/* Window chrome */}
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                            <span className="ml-3 text-slate-500 text-xs font-mono">app/page.tsx</span>
                        </div>

                        <pre className="p-6 text-sm font-mono leading-relaxed overflow-x-auto">
                            <code>
                                <span style={{ color: '#7c3aed' }}>import</span>
                                <span style={{ color: '#e2e8f0' }}> {'{ createClient }'} </span>
                                <span style={{ color: '#7c3aed' }}>from</span>
                                <span style={{ color: '#34d399' }}> &apos;matecitodb&apos;</span>
                                {'\n\n'}
                                <span style={{ color: '#64748b' }}>{'// Inicializá el cliente'}</span>
                                {'\n'}
                                <span style={{ color: '#7c3aed' }}>const</span>
                                <span style={{ color: '#e2e8f0' }}> db </span>
                                <span style={{ color: '#94a3b8' }}>=</span>
                                <span style={{ color: '#38bdf8' }}> createClient</span>
                                <span style={{ color: '#e2e8f0' }}>{'({'}</span>
                                {'\n'}
                                <span style={{ color: '#e2e8f0' }}>{'  '}</span>
                                <span style={{ color: '#f8fafc' }}>url</span>
                                <span style={{ color: '#94a3b8' }}>:</span>
                                <span style={{ color: '#e2e8f0' }}> process.env.</span>
                                <span style={{ color: '#34d399' }}>NEXT_PUBLIC_MATECITODB_URL</span>
                                <span style={{ color: '#e2e8f0' }}>,</span>
                                {'\n'}
                                <span style={{ color: '#e2e8f0' }}>{'  '}</span>
                                <span style={{ color: '#f8fafc' }}>projectId</span>
                                <span style={{ color: '#94a3b8' }}>:</span>
                                <span style={{ color: '#e2e8f0' }}> process.env.</span>
                                <span style={{ color: '#34d399' }}>NEXT_PUBLIC_MATECITODB_PROJECT_ID</span>
                                <span style={{ color: '#e2e8f0' }}>,</span>
                                {'\n'}
                                <span style={{ color: '#e2e8f0' }}>{'  '}</span>
                                <span style={{ color: '#f8fafc' }}>anonKey</span>
                                <span style={{ color: '#94a3b8' }}>:</span>
                                <span style={{ color: '#e2e8f0' }}> process.env.</span>
                                <span style={{ color: '#34d399' }}>NEXT_PUBLIC_MATECITODB_ANON_KEY</span>
                                <span style={{ color: '#e2e8f0' }}>,</span>
                                {'\n'}
                                <span style={{ color: '#e2e8f0' }}>{'});'}</span>
                                {'\n\n'}
                                <span style={{ color: '#64748b' }}>{'// Obtener registros'}</span>
                                {'\n'}
                                <span style={{ color: '#7c3aed' }}>const</span>
                                <span style={{ color: '#e2e8f0' }}> {'{ records }'} </span>
                                <span style={{ color: '#94a3b8' }}>=</span>
                                <span style={{ color: '#7c3aed' }}> await</span>
                                <span style={{ color: '#e2e8f0' }}> db.records.</span>
                                <span style={{ color: '#38bdf8' }}>list</span>
                                <span style={{ color: '#e2e8f0' }}>{'('}</span>
                                <span style={{ color: '#34d399' }}>&apos;comercios&apos;</span>
                                <span style={{ color: '#e2e8f0' }}>{', {'}</span>
                                {'\n'}
                                <span style={{ color: '#e2e8f0' }}>{'  filter: { '}</span>
                                <span style={{ color: '#f8fafc' }}>category</span>
                                <span style={{ color: '#94a3b8' }}>:</span>
                                <span style={{ color: '#34d399' }}> &apos;Restaurante&apos;</span>
                                <span style={{ color: '#e2e8f0' }}>{' },'}</span>
                                {'\n'}
                                <span style={{ color: '#e2e8f0' }}>{'  limit: '}</span>
                                <span style={{ color: '#fb923c' }}>10</span>
                                <span style={{ color: '#e2e8f0' }}>,</span>
                                {'\n'}
                                <span style={{ color: '#e2e8f0' }}>{'})'}</span>
                            </code>
                        </pre>
                    </div>
                </div>
            </section>

            {/* ── SOCIAL PROOF / TRUST BAR ─────────────────────── */}
            <section className="py-12 px-6 bg-gradient-to-br from-violet-600 to-violet-700">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white font-semibold text-sm">
                            Usado en producción en{' '}
                            <a href="https://recienllegue.com.ar" target="_blank" rel="noopener noreferrer"
                                className="underline underline-offset-2 hover:text-violet-200 transition-colors">
                                recienllegue.ar
                            </a>
                        </span>
                    </div>
                    <div className="hidden sm:block w-px h-6 bg-white/20" />
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-violet-300" />
                        <span className="text-violet-200 font-medium text-sm">Made in Pergamino, Argentina</span>
                    </div>
                </div>
            </section>

            {/* ── NEWSLETTER ───────────────────────────────────── */}
            <section id="newsletter" className="py-20 px-6 border-t border-slate-200">
                <div className="max-w-xl mx-auto text-center space-y-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Acceso anticipado</p>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Enterarte cuando lanzamos
                    </h2>
                    <p className="text-slate-500 leading-relaxed">
                        Dejá tu email y te avisamos cuando abramos el acceso público a{' '}
                        <span className="font-semibold text-slate-700">matecitodb</span>.
                        Sin spam, solo lo importante.
                    </p>
                    <div className="[&_section]:py-0 [&_section]:border-0 [&_section]:bg-transparent [&_.container]:px-0 [&_h2]:hidden [&_p]:hidden [&_span]:hidden [&_input]:border-violet-200 [&_input]:focus:border-violet-500 [&_button]:bg-violet-600 [&_button:hover]:bg-violet-700">
                        <NewsletterForm />
                    </div>
                </div>
            </section>

        </div>
    )
}
