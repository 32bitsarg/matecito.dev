'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useProject } from '@/contexts/ProjectContext'
import { 
    Key, 
    RefreshCw, 
    Save, 
    ShieldCheck, 
    Github, 
    Twitter, 
    Disc,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    Lock,
    Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const SUPPORTED_PROVIDERS = [
    { id: 'google', name: 'Google', icon: Globe, color: 'text-red-400' },
    { id: 'github', name: 'GitHub', icon: Github, color: 'text-white' },
    { id: 'discord', name: 'Discord', icon: Disc, color: 'text-indigo-400' },
    { id: 'gitlab', name: 'GitLab', icon: ShieldCheck, color: 'text-orange-400' },
    { id: 'facebook', name: 'Facebook', icon: ShieldCheck, color: 'text-blue-500' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
]


export default function ProvidersPage() {
    const params = useParams()
    const { getSettings, updateSettings, loading: contextLoading } = useProject()
    const [settings, setSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const loadSettings = async () => {
        setLoading(true)
        try {
            const res = await getSettings()
            setSettings(res)
        } catch (err: any) {
            toast.error("Error al cargar configuración: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSettings()
    }, [])

    const handleToggleProvider = (providerId: string, enabled: boolean) => {
        setSettings((prev: any) => ({
            ...prev,
            [providerId + 'Auth']: {
                ...prev[providerId + 'Auth'],
                enabled
            }
        }))
    }

    const handleUpdateCreds = (providerId: string, key: string, value: string) => {
        setSettings((prev: any) => ({
            ...prev,
            [providerId + 'Auth']: {
                ...prev[providerId + 'Auth'],
                [key]: value
            }
        }))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await updateSettings(settings)
            toast.success("Configuración de Identity Providers actualizada")
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
                <p className="text-[10px] font-mono uppercase tracking-widest">Sincronizando Proveedores de Identidad...</p>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-accent/10 rounded-3xl text-accent border border-accent/20 shadow-lg shadow-accent/5">
                        <Key className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">OAuth2 Providers</h1>
                        <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mt-1">
                            Configura el acceso social (Google, GitHub, etc.) para tus usuarios
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-accent text-background text-sm font-black hover:opacity-90 transition-all shadow-xl shadow-accent/10 uppercase tracking-widest disabled:opacity-50"
                >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Guardar Configuración
                </button>
            </div>

            {/* Providers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {SUPPORTED_PROVIDERS.map((provider) => {
                    const config = settings?.[provider.id + 'Auth'] || { enabled: false }
                    return (
                        <div 
                            key={provider.id}
                            className={cn(
                                "bg-card/20 border rounded-[2.5rem] p-8 flex flex-col space-y-6 transition-all relative overflow-hidden group",
                                config.enabled ? "border-accent/40 bg-accent/[0.02]" : "border-white/5 opacity-60 hover:opacity-100"
                            )}
                        >
                            {/* Card Background Decoration */}
                            <div className="absolute -right-4 -top-4 opacity-[0.02] group-hover:opacity-[0.05] transition-all group-hover:scale-110">
                                <provider.icon size={120} />
                            </div>

                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/10", provider.color)}>
                                        <provider.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white">{provider.name}</h3>
                                        <p className="text-[10px] text-muted font-mono uppercase tracking-widest">Provider ID: {provider.id}</p>
                                    </div>
                                </div>
                                
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={config.enabled}
                                        onChange={(e) => handleToggleProvider(provider.id, e.target.checked)}
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent shadow-inner"></div>
                                </label>
                            </div>

                            {config.enabled && (
                                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300 relative z-10">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Client ID</label>
                                        <input 
                                            type="text"
                                            value={config.clientId || ''}
                                            onChange={(e) => handleUpdateCreds(provider.id, 'clientId', e.target.value)}
                                            placeholder={`Ingresa Client ID de ${provider.name}`}
                                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-accent/40 outline-none transition-all placeholder:text-muted/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Client Secret</label>
                                        <div className="relative">
                                            <input 
                                                type="password"
                                                value={config.clientSecret || ''}
                                                onChange={(e) => handleUpdateCreds(provider.id, 'clientSecret', e.target.value)}
                                                placeholder={`••••••••••••••••`}
                                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 pr-10 text-xs text-white focus:border-accent/40 outline-none transition-all placeholder:text-muted/20"
                                            />
                                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/20" />
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 flex items-center gap-3">
                                        <div className="text-[10px] text-muted leading-relaxed italic bg-white/5 border border-white/5 p-3 rounded-xl flex items-start gap-2">
                                            <AlertCircle className="w-3.5 h-3.5 mt-0.5 text-accent/50" />
                                            Recordá configurar la Redirect URL en el portal de {provider.name}: <br/>
                                            <code className="text-accent underline font-mono text-[9px] break-all">https://{params?.projectSlug}.matecito.dev/api/oauth2-redirect</code>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!config.enabled && (
                                <div className="py-10 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center opacity-30 select-none">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Provider Disabled</p>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
