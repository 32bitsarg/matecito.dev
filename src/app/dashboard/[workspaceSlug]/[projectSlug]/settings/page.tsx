'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useProject } from '@/contexts/ProjectContext'
import { 
    Settings, 
    Mail, 
    ShieldCheck, 
    Globe, 
    Lock, 
    Save, 
    RefreshCw, 
    Server, 
    MailCheck, 
    UserCheck,
    Link,
    Terminal,
    Eye,
    EyeOff,
    Cloud
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function SettingsPage() {
    const { getSettings, updateSettings } = useProject()
    const [settings, setSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showSmtpPass, setShowSmtpPass] = useState(false)

    const loadSettings = async () => {
        setLoading(true)
        try {
            const res = await getSettings()
            setSettings(res)
        } catch (err: any) {
            toast.error("Error al cargar configuración")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSettings()
    }, [])

    const handleUpdate = (path: string, value: any) => {
        setSettings((prev: any) => {
            const next = { ...prev }
            const keys = path.split('.')
            let current = next
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] }
                current = current[keys[i]]
            }
            current[keys[keys.length - 1]] = value
            return next
        })
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await updateSettings(settings)
            toast.success("Configuración de instancia actualizada")
        } catch (err: any) {
            toast.error("Error al guardar: " + err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                <RefreshCw className="w-10 h-10 animate-spin text-accent" />
                <p className="text-[10px] font-mono uppercase tracking-widest">Sincronizando Parámetros de Sistema...</p>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-accent/10 rounded-3xl text-accent border border-accent/20 shadow-lg shadow-accent/5">
                        <Settings className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Project Settings</h1>
                        <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mt-1">
                            Configuración global de tu instancia Matebase
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-accent text-background text-sm font-black hover:opacity-90 transition-all shadow-xl shadow-accent/10 uppercase tracking-widest disabled:opacity-50"
                >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Guardar Cambios
                </button>
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
                
                {/* Section: General */}
                <div className="bg-card/20 border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white">General & Branding</h3>
                            <p className="text-[10px] text-muted font-mono uppercase tracking-widest">Metadatos visibles de tu app</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <SettingField label="App Name" desc="Nombre público de tu proyecto">
                            <input 
                                type="text" 
                                value={settings?.meta?.appName || ''} 
                                onChange={(e) => handleUpdate('meta.appName', e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-accent/40 outline-none transition-all"
                            />
                        </SettingField>
                        <SettingField label="App URL" desc="URL base para enlaces y redirects">
                            <input 
                                type="text" 
                                value={settings?.meta?.appUrl || ''} 
                                onChange={(e) => handleUpdate('meta.appUrl', e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-accent/40 outline-none transition-all"
                            />
                        </SettingField>
                    </div>
                </div>

                {/* Section: Auth Settings */}
                <div className="bg-card/20 border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white">Authentication Rules</h3>
                            <p className="text-[10px] text-muted font-mono uppercase tracking-widest">Políticas de registro y acceso</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <ToggleField 
                            label="Email Registration" 
                            desc="Permite a nuevos usuarios registrarse vía email" 
                            checked={settings?.authSettings?.allowEmailAuth || false}
                            onChange={(v: boolean) => handleUpdate('authSettings.allowEmailAuth', v)}
                         />
                         <ToggleField 
                            label="OAuth2 Registration" 
                            desc="Permite crear cuentas vía social login" 
                            checked={settings?.authSettings?.allowOAuth2Auth || false}
                            onChange={(v: boolean) => handleUpdate('authSettings.allowOAuth2Auth', v)}
                         />
                    </div>
                </div>

                {/* Section: Cloud Storage (S3) */}
                <div className="bg-card/20 border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
                            <Cloud className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white">Cloud Storage (S3/R2)</h3>
                            <p className="text-[10px] text-muted font-mono uppercase tracking-widest">Offload de archivos y media (Recomendado para VPS)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <ToggleField 
                            label="Enable S3 Storage" 
                            desc="Usa un proveedor compatible con S3 en lugar de disco local" 
                            checked={settings?.backups?.s3?.enabled || false}
                            onChange={(v: boolean) => handleUpdate('backups.s3.enabled', v)}
                         />
                         <SettingField label="Endpoint" desc="URL del proveedor (ej: s3.amazonaws.com)">
                            <input 
                                type="text" 
                                value={settings?.backups?.s3?.endpoint || ''} 
                                onChange={(e) => handleUpdate('backups.s3.endpoint', e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none"
                            />
                        </SettingField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <SettingField label="Bucket Name" desc="Nombre del contenedor">
                            <input 
                                type="text" 
                                value={settings?.backups?.s3?.bucket || ''} 
                                onChange={(e) => handleUpdate('backups.s3.bucket', e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none"
                            />
                        </SettingField>
                        <SettingField label="Region" desc="Región del datacenter">
                            <input 
                                type="text" 
                                value={settings?.backups?.s3?.region || ''} 
                                onChange={(e) => handleUpdate('backups.s3.region', e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none"
                            />
                        </SettingField>
                        <SettingField label="Access Key" desc="Credencial de acceso">
                            <input 
                                type="text" 
                                value={settings?.backups?.s3?.accessKey || ''} 
                                onChange={(e) => handleUpdate('backups.s3.accessKey', e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none"
                            />
                        </SettingField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <SettingField label="Secret Key" desc="Llave secreta de seguridad">
                            <div className="relative">
                                <input 
                                    type={showSmtpPass ? "text" : "password"} 
                                    value={settings?.backups?.s3?.secretKey || ''} 
                                    onChange={(e) => handleUpdate('backups.s3.secretKey', e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none"
                                />
                            </div>
                        </SettingField>
                        <div className="flex items-center justify-end p-6 bg-accent/5 rounded-2xl border border-accent/10">
                             <p className="text-[10px] text-accent/60 italic leading-tight">
                                Nota: Al activar S3, los nuevos archivos se subirán <br/> directamente al bucket configurado.
                             </p>
                        </div>
                    </div>
                </div>

                {/* Section: Email/SMTP */}
                <div className="bg-card/20 border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent/10 rounded-2xl text-accent border border-accent/20">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white">SMTP Server (Email)</h3>
                            <p className="text-[10px] text-muted font-mono uppercase tracking-widest">Envío de emails transaccionales</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <SettingField label="Host" desc="Hoster del servidor SMTP">
                            <input 
                                type="text" 
                                value={settings?.smtp?.host || ''} 
                                onChange={(e) => handleUpdate('smtp.host', e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none"
                            />
                        </SettingField>
                        <SettingField label="Port" desc="Habitualmente 465 o 587">
                            <input 
                                type="number" 
                                value={settings?.smtp?.port || ''} 
                                onChange={(e) => handleUpdate('smtp.port', Number(e.target.value))}
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none"
                            />
                        </SettingField>
                         <SettingField label="User" desc="Nombre de usuario o email">
                            <input 
                                type="text" 
                                value={settings?.smtp?.username || ''} 
                                onChange={(e) => handleUpdate('smtp.username', e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none"
                            />
                        </SettingField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <SettingField label="Password" desc="Contraseña o App Password de SMTP">
                            <div className="relative">
                                <input 
                                    type={showSmtpPass ? "text" : "password"} 
                                    value={settings?.smtp?.password || ''} 
                                    onChange={(e) => handleUpdate('smtp.password', e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 pr-10 text-xs text-white outline-none"
                                />
                                <button 
                                    onClick={() => setShowSmtpPass(!showSmtpPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/20 hover:text-white transition-all"
                                >
                                    {showSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </SettingField>
                        <ToggleField 
                            label="TLS Support" 
                            desc="Habilitar encriptación segura TLS" 
                            checked={settings?.smtp?.tls || false}
                            onChange={(v: boolean) => handleUpdate('smtp.tls', v)}
                         />
                    </div>
                </div>

            </div>
        </div>
    )
}

function SettingField({ label, desc, children }: any) {
    return (
        <div className="space-y-2">
            <div className="flex flex-col ml-1 mb-1">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{label}</span>
                <span className="text-[9px] text-muted tracking-tighter italic">{desc}</span>
            </div>
            {children}
        </div>
    )
}

function ToggleField({ label, desc, checked, onChange }: any) {
    return (
        <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-all">
            <div className="space-y-1">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">{label}</p>
                <p className="text-[9px] text-muted tracking-tighter">{desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only peer" 
                />
                <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
            </label>
        </div>
    )
}
