'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
    Lock, 
    ShieldCheck, 
    ShieldAlert, 
    Mail, 
    Globe, 
    Save, 
    RefreshCw, 
    CheckCircle2, 
    AlertTriangle,
    ArrowRight,
    Server,
    Key,
    UserCircle,
    Send
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useProject } from '@/contexts/ProjectContext'

interface AuthConfig {
  requireVerification: boolean
  emailVisibility: boolean
  passwordAuth: {
    enabled: boolean
  }
  mfa: {
    enabled: boolean
  }
  oauth2: {
    enabled: boolean
    providers: { name: string, clientId: string, clientSecret: string }[]
  }
}

interface SmtpConfig {
    enabled: boolean
    host: string
    port: number
    username: string
    password: string
    senderName: string
    senderAddress: string
}

export function AuthSettings() {
    const { workspace: workspaceSlug, project: projectSlug } = useParams()
    const { getSettings, updateSettings, updateCollection, testSmtp, project } = useProject()
    
    const [config, setConfig] = useState<AuthConfig | null>(null)
    const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>({
        enabled: false,
        host: '',
        port: 587,
        username: '',
        password: '',
        senderName: 'Matecito App',
        senderAddress: ''
    })
    
    const [originalConfig, setOriginalConfig] = useState<AuthConfig | null>(null)
    const [originalSmtp, setOriginalSmtp] = useState<SmtpConfig | null>(null)
    
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [testingSmtp, setTestingSmtp] = useState(false)
    const [googleConfig, setGoogleConfig] = useState({ clientId: '', clientSecret: '' })

    const fetchAllSettings = useCallback(async () => {
        if (!project?.subdomain) return
        
        try {
            // 1. Obtener settings globales (SMTP)
            const global = await getSettings()
            if (global.smtp) {
                const s = {
                    enabled: global.smtp.enabled || false,
                    host: global.smtp.host || '',
                    port: global.smtp.port || 587,
                    username: global.smtp.username || '',
                    password: global.smtp.password || '',
                    senderName: global.meta?.senderName || 'Matecito App',
                    senderAddress: global.meta?.senderAddress || ''
                }
                setSmtpConfig(s)
                setOriginalSmtp(JSON.parse(JSON.stringify(s)))
            }

            // 2. Obtener settings de colección via nuestra API
            const res = await fetch(`/api/v1/projects/auth-settings?subdomain=${project?.subdomain}&adminToken=${project?.admin_token}`)
            const data = await res.json()
            
            const googleProv = data.oauth2?.providers?.find((p: any) => p.name === 'google')
            if (googleProv) {
                setGoogleConfig({ clientId: googleProv.clientId || '', clientSecret: googleProv.clientSecret || '' })
            }
            
            setConfig(data)
            setOriginalConfig(JSON.parse(JSON.stringify(data)))
        } catch (err: any) {
            toast.error("Fallo al cargar configuración: " + err.message)
        } finally {
            setLoading(false)
        }
    }, [project?.subdomain, project?.admin_token, getSettings])

    useEffect(() => {
        fetchAllSettings()
    }, [fetchAllSettings])

    const hasChanges = (config && originalConfig && (
        JSON.stringify(config) !== JSON.stringify(originalConfig) ||
        JSON.stringify(smtpConfig) !== JSON.stringify(originalSmtp) ||
        (config.oauth2?.providers?.find(p => p.name === 'google')?.clientId !== googleConfig.clientId) ||
        (config.oauth2?.providers?.find(p => p.name === 'google')?.clientSecret !== googleConfig.clientSecret)
    ))

    const handleToggle = (key: string, path?: string) => {
        if (!config) return
        
        setConfig(prev => {
            if (!prev) return null
            if (path === 'passwordAuth') return { ...prev, passwordAuth: { enabled: !prev.passwordAuth.enabled } }
            if (path === 'mfa') return { ...prev, mfa: { enabled: !prev.mfa.enabled } }
            if (path === 'oauth2') {
                const isNowEnabled = !prev.oauth2.enabled
                return { 
                    ...prev, 
                    oauth2: { 
                        ...prev.oauth2, 
                        enabled: isNowEnabled,
                        providers: isNowEnabled ? [{ name: 'google', ...googleConfig }] : []
                    } 
                }
            }
            return { ...prev, [key]: !prev[key as keyof AuthConfig] }
        })
    }

    const saveSettings = async () => {
        if (!config) return
        setSaving(true)
        
        try {
            // 1. Guardar settings de la colección (Verification, Google ID, etc)
            const finalAuthSettings = {
                ...config,
                oauth2: {
                    ...config.oauth2,
                    providers: config.oauth2.enabled ? [{ name: 'google', ...googleConfig }] : []
                }
            }

            const authRes = await fetch('/api/v1/projects/auth-settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subdomain: project?.subdomain,
                    adminToken: project?.admin_token,
                    settings: {
                        requireVerification: finalAuthSettings.requireVerification,
                        emailVisibility: finalAuthSettings.emailVisibility,
                        passwordAuth: finalAuthSettings.passwordAuth,
                        mfa: finalAuthSettings.mfa,
                        oauth2: finalAuthSettings.oauth2
                    }
                })
            })

            const authData = await authRes.json()
            if (authData.error) throw new Error("Error en Auth: " + authData.error)

            // 2. Guardar settings de SMTP via ProjectContext (Global)
            await updateSettings({
                smtp: {
                    enabled: true, // Siempre lo activamos si el usuario guarda datos aquí
                    host: smtpConfig.host,
                    port: Number(smtpConfig.port),
                    username: smtpConfig.username,
                    password: smtpConfig.password,
                    authMethod: 'LOGIN',
                    tls: Number(smtpConfig.port) === 465,
                    localName: 'localhost'
                },
                meta: {
                    senderName: smtpConfig.senderName,
                    senderAddress: smtpConfig.senderAddress
                }
            })
            
            toast.success("Toda la configuración ha sido actualizada")
            setOriginalConfig(JSON.parse(JSON.stringify(finalAuthSettings)))
            setOriginalSmtp(JSON.parse(JSON.stringify(smtpConfig)))
        } catch (err: any) {
            toast.error("Error al guardar: " + err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleTestSmtp = async () => {
        if (!smtpConfig.senderAddress) {
            toast.error("Ingresa un email de remitente para probar")
            return
        }
        
        const testEmail = prompt("Ingresa el email donde quieres recibir la prueba:", smtpConfig.senderAddress)
        if (!testEmail) return

        setTestingSmtp(true)
        try {
            await testSmtp(testEmail)
            toast.success("Email de prueba enviado. Revisa tu bandeja de entrada.")
        } catch (err: any) {
            toast.error("Fallo el test SMTP: " + err.message)
        } finally {
            setTestingSmtp(false)
        }
    }

    if (loading) return (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-[2rem] p-12 flex flex-col items-center justify-center space-y-4 animate-pulse">
            <RefreshCw className="w-8 h-8 text-accent animate-spin" />
            <p className="text-[10px] font-black uppercase text-muted tracking-widest">Cargando módulos de identidad...</p>
        </div>
    )

    return (
        <div className="relative">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10">
                {/* Header */}
                <div className="p-8 border-b border-[#2a2a2a] bg-black/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                            <Lock className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Autenticación e Identidad</h2>
                            <p className="text-[9px] font-mono text-muted uppercase tracking-widest mt-1">Configura el acceso para tus usuarios finales</p>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-[#2a2a2a]">
                    {/* Sección 1: Métodos de Login */}
                    <section className="p-8 space-y-8">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Métodos de autenticación</h3>
                            <p className="text-[10px] text-muted/60 mt-1 font-medium italic">Configura cómo pueden ingresar los usuarios de tu app</p>
                        </div>

                        <div className="space-y-6">
                            <ToggleCard 
                                label="Email y contraseña"
                                description="Los usuarios se registran con email y contraseña estándar"
                                icon={Mail}
                                active={config?.passwordAuth?.enabled || false}
                                disabled={true}
                                tooltip="Próximamente ocultar este método"
                                onToggle={() => handleToggle('', 'passwordAuth')}
                            />

                            <div className="space-y-4">
                                <ToggleCard 
                                    label="Google"
                                    description="Permitir login rápido con cuenta de Google OAuth"
                                    icon={Globe}
                                    active={config?.oauth2?.enabled || false}
                                    onToggle={() => handleToggle('', 'oauth2')}
                                />
                                
                                {config?.oauth2?.enabled && (
                                    <div className="ml-14 p-6 bg-black/40 border border-[#2a2a2a] rounded-3xl space-y-4 animate-in slide-in-from-top-2 duration-300">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Credenciales de Google OAuth</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-black uppercase text-muted tracking-widest ml-1">Client ID</label>
                                                <input 
                                                    type="text" 
                                                    value={googleConfig.clientId}
                                                    onChange={(e) => setGoogleConfig(prev => ({ ...prev, clientId: e.target.value }))}
                                                    className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-[10px] font-mono text-white outline-none focus:border-accent/30 transition-all"
                                                    placeholder="12345-abc.apps.googleusercontent.com"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-black uppercase text-muted tracking-widest ml-1">Client Secret</label>
                                                <input 
                                                    type="password" 
                                                    value={googleConfig.clientSecret}
                                                    onChange={(e) => setGoogleConfig(prev => ({ ...prev, clientSecret: e.target.value }))}
                                                    className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-[10px] font-mono text-white outline-none focus:border-accent/30 transition-all"
                                                    placeholder="••••••••••••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Sección 2: Seguridad y Verificación */}
                    <section className="p-8 space-y-8">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Seguridad y Verificación</h3>
                            <p className="text-[10px] text-muted/60 mt-1 font-medium italic">Políticas de validación de identidad</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <ToggleCard 
                                    label="Requerir verificación de email"
                                    description="Los usuarios deben verificar su email antes de poder usar la app"
                                    icon={ShieldCheck}
                                    active={config?.requireVerification ?? true}
                                    onToggle={() => handleToggle('requireVerification')}
                                />
                                <div className="ml-14 flex flex-wrap gap-2">
                                    {config?.requireVerification ? (
                                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent/10 border border-accent/20 text-[8px] font-black uppercase text-accent">
                                            <CheckCircle2 size={10} /> ✓ Los nuevos usuarios recibirán un email de verificación
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-400/10 border border-red-400/20 text-[8px] font-black uppercase text-red-400">
                                            <AlertTriangle size={10} /> ⚠️ Sin verificación — cualquier email puede registrarse
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección 3: Configuración SMTP */}
                    <section className="p-8 space-y-8 bg-accent/[0.01]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Configuración de Correo (SMTP)</h3>
                                <p className="text-[10px] text-muted/60 mt-1 font-medium italic">Necesario para enviar emails de verificación y recuperación</p>
                            </div>
                            <button 
                                onClick={handleTestSmtp}
                                disabled={testingSmtp}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase text-white hover:bg-white/10 transition-all active:scale-95"
                            >
                                {testingSmtp ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                Probar Conexión
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Host y Puerto */}
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Server className="w-3 h-3 text-accent" />
                                        <label className="text-[8px] font-black uppercase text-muted tracking-widest">Servidor SMTP</label>
                                    </div>
                                    <input 
                                        type="text" 
                                        value={smtpConfig.host}
                                        onChange={(e) => setSmtpConfig(prev => ({ ...prev, host: e.target.value }))}
                                        className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[10px] font-mono text-white outline-none focus:border-accent/30 transition-all"
                                        placeholder="smtp.gmail.com"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black uppercase text-muted tracking-widest ml-1">Puerto</label>
                                    <input 
                                        type="number" 
                                        value={smtpConfig.port}
                                        onChange={(e) => setSmtpConfig(prev => ({ ...prev, port: parseInt(e.target.value) || 587 }))}
                                        className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[10px] font-mono text-white outline-none focus:border-accent/30 transition-all"
                                        placeholder="587 o 465"
                                    />
                                </div>
                            </div>

                            {/* Credenciales */}
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <UserCircle className="w-3 h-3 text-accent" />
                                        <label className="text-[8px] font-black uppercase text-muted tracking-widest">Usuario / Email</label>
                                    </div>
                                    <input 
                                        type="text" 
                                        value={smtpConfig.username}
                                        onChange={(e) => setSmtpConfig(prev => ({ ...prev, username: e.target.value }))}
                                        className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[10px] font-mono text-white outline-none focus:border-accent/30 transition-all"
                                        placeholder="usuario@dominio.com"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Key className="w-3 h-3 text-accent" />
                                        <label className="text-[8px] font-black uppercase text-muted tracking-widest">Contraseña / App Token</label>
                                    </div>
                                    <input 
                                        type="password" 
                                        value={smtpConfig.password}
                                        onChange={(e) => setSmtpConfig(prev => ({ ...prev, password: e.target.value }))}
                                        className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[10px] font-mono text-white outline-none focus:border-accent/30 transition-all"
                                        placeholder="••••••••••••••••"
                                    />
                                </div>
                            </div>

                             {/* Remitente */}
                             <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black uppercase text-muted tracking-widest ml-1">Nombre Remitente</label>
                                    <input 
                                        type="text" 
                                        value={smtpConfig.senderName}
                                        onChange={(e) => setSmtpConfig(prev => ({ ...prev, senderName: e.target.value }))}
                                        className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[10px] font-mono text-white outline-none focus:border-accent/30 transition-all"
                                        placeholder="Ej: Matecito Team"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black uppercase text-muted tracking-widest ml-1">Email Remitente (De:)</label>
                                    <input 
                                        type="email" 
                                        value={smtpConfig.senderAddress}
                                        onChange={(e) => setSmtpConfig(prev => ({ ...prev, senderAddress: e.target.value }))}
                                        className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[10px] font-mono text-white outline-none focus:border-accent/30 transition-all"
                                        placeholder="no-reply@tudominio.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección 4: Usuarios */}
                    <section className="p-8 bg-black/10">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-muted">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black uppercase text-white">Gestión de usuarios</h3>
                                    <p className="text-[9px] text-muted tracking-tight mt-0.5 font-medium italic">Accede a la base de datos completa de usuarios</p>
                                </div>
                            </div>
                            <Link 
                                href={`/dashboard/${workspaceSlug}/${projectSlug}/users`}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase text-white hover:bg-accent hover:text-background hover:border-accent transition-all group"
                            >
                                Ver todos los usuarios
                                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                         </div>
                    </section>
                </div>
            </div>

            {/* Floating Save Button */}
            {hasChanges && (
                <div className="fixed bottom-10 right-10 z-50 animate-in slide-in-from-bottom-5 duration-300">
                    <button
                        onClick={saveSettings}
                        disabled={saving}
                        className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-accent text-background text-sm font-black shadow-2xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Guardar cambios globales
                    </button>
                </div>
            )}
        </div>
    )
}

interface ToggleCardProps {
    label: string
    description: string
    icon: any
    active: boolean
    onToggle: () => void
    disabled?: boolean
    tooltip?: string
}

function ToggleCard({ label, description, icon: Icon, active, onToggle, disabled, tooltip }: ToggleCardProps) {
    return (
        <div className={cn(
            "flex items-center justify-between p-1 group transition-all",
            disabled ? "cursor-not-allowed opacity-80" : "cursor-pointer"
        )} onClick={() => !disabled && onToggle()}>
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                    active 
                        ? "bg-accent/10 border-accent/30 text-accent group-hover:scale-110" 
                        : "bg-white/5 border-white/5 text-muted group-hover:border-white/10"
                )}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-white uppercase tracking-tight">{label}</p>
                    <p className="text-[10px] text-muted/50 font-medium leading-tight max-w-sm">{description}</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {disabled && tooltip && (
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-[7px] font-black uppercase text-muted/30 border border-white/5 tracking-wider">{tooltip}</span>
                )}
                <div className={cn(
                    "w-10 h-5.5 rounded-full p-1 transition-all flex items-center shadow-inner",
                    active ? "bg-[#3ECF8E]" : "bg-[#333]"
                )}>
                    <div className={cn(
                        "w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all",
                        active ? "translate-x-5" : "translate-x-0"
                    )} />
                </div>
            </div>
        </div>
    )
}
