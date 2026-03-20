'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useProject } from '@/contexts/ProjectContext'
import { 
    Users, 
    UserPlus, 
    RefreshCw, 
    Mail, 
    ShieldCheck, 
    ShieldAlert, 
    MoreVertical,
    Trash2,
    Key,
    UserCheck,
    UserX,
    Search,
    ChevronRight,
    ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import RecordModal from '@/components/project-admin/record-modal'
import { AuthSettings } from '@/components/project-admin/AuthSettings'

export default function UsersPage() {
    const { workspaceSlug, projectSlug } = useParams()
    const {
        records,
        loading,
        fetchRecords,
        getCollectionSchema,
        deleteRecord,
        updateRecord,
        project
    } = useProject()

    const [view, setView] = useState<'users' | 'settings'>('users')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const userCollection = getCollectionSchema('users')

    const loadUsers = async () => {
        setIsRefreshing(true)
        await fetchRecords('users')
        setIsRefreshing(false)
    }

    useEffect(() => {
        if (view === 'users') {
            loadUsers()
        }
    }, [view])

    const handleResetPassword = async (user: any) => {
        toast.info(`Funcionalidad de reset para ${user.email} en desarrollo`)
    }

    const handleDeleteUser = async (user: any) => {
        if (!confirm(`¿Estás seguro de eliminar al usuario ${user.email}?`)) return
        try {
            await deleteRecord('users', user.id)
            toast.success('Usuario eliminado')
            loadUsers()
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const toggleVerification = async (user: any) => {
        try {
            await updateRecord('users', user.id, { verified: !user.verified })
            toast.success(user.verified ? 'Verificación removida' : 'Usuario verificado manualmente')
            loadUsers()
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const filteredUsers = records.filter(u => 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.username?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                        <span>Proyecto</span>
                        <ChevronRight className="w-3 h-3" />
                        <span>Autenticación e Identidad</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white">
                        Autenticación <span className="text-accent">e Identidad</span>
                    </h1>
                </div>

                <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/5 rounded-2xl w-fit">
                    <button 
                        onClick={() => setView('users')}
                        className={cn(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            view === 'users' ? "bg-accent text-background shadow-lg shadow-accent/20" : "text-muted hover:text-white"
                        )}
                    >
                        Usuarios
                    </button>
                    <button 
                        onClick={() => setView('settings')}
                        className={cn(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            view === 'settings' ? "bg-accent text-background shadow-lg shadow-accent/20" : "text-muted hover:text-white"
                        )}
                    >
                        Configuración
                    </button>
                </div>
            </div>

            {view === 'settings' ? (
                <div className="animate-in slide-in-from-bottom-5 duration-500">
                    <AuthSettings />
                </div>
            ) : (
                <div className="space-y-10 animate-in slide-in-from-bottom-5 duration-500">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard 
                            label="Total Usuarios" 
                            value={records.length} 
                            icon={Users} 
                            color="text-blue-400"
                        />
                        <StatCard 
                            label="Verificados" 
                            value={records.filter(u => u.verified).length} 
                            icon={ShieldCheck} 
                            color="text-accent"
                        />
                        <StatCard 
                            label="Nuevos (Hoy)" 
                            value={records.filter(u => new Date(u.created).toDateString() === new Date().toDateString()).length} 
                            icon={Mail} 
                            color="text-purple-400"
                        />
                    </div>

                    {/* Content Area */}
                    <div className="bg-card/30 border border-border/50 rounded-[2.5rem] overflow-hidden flex flex-col backdrop-blur-sm shadow-2xl">
                        {/* Search Bar & Actions */}
                        <div className="p-8 border-b border-white/5 bg-black/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="relative flex-1 w-full max-w-md group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
                                <input 
                                    type="text"
                                    placeholder="Buscar por email o username..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-black/40 border border-border rounded-2xl pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-accent/40 transition-all font-medium"
                                />
                            </div>
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <button
                                    onClick={loadUsers}
                                    disabled={loading || isRefreshing}
                                    className="p-3 rounded-2xl bg-white/5 border border-white/10 text-muted hover:text-white transition-all hover:bg-white/10"
                                >
                                    <RefreshCw className={cn("w-5 h-5", (loading || isRefreshing) && "animate-spin")} />
                                </button>
                                <button
                                    onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-accent text-background text-xs font-black hover:opacity-90 transition-all shadow-xl shadow-accent/10 uppercase tracking-widest"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Crear Usuario
                                </button>
                            </div>
                        </div>

                        {/* Users List */}
                        <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
                            {loading && !isRefreshing ? (
                                <div className="h-[400px] flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                        <RefreshCw className="w-10 h-10 text-accent animate-spin" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Consultando registro...</p>
                                    </div>
                                </div>
                            ) : filteredUsers.length > 0 ? (
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/[0.01]">
                                            <th className="p-6 px-10 text-[9px] font-black uppercase text-muted tracking-widest">Usuario</th>
                                            <th className="p-6 text-[9px] font-black uppercase text-muted tracking-widest text-center">Estado</th>
                                            <th className="p-6 text-[9px] font-black uppercase text-muted tracking-widest">Creado</th>
                                            <th className="p-6 px-10 text-[9px] font-black uppercase text-muted tracking-widest text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 font-medium">
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="p-6 px-10">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/20 shadow-inner group-hover:scale-105 transition-all">
                                                            <span className="text-accent font-black uppercase text-xl">
                                                                {(user.email || user.username || '?')[0]}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white leading-tight">{user.email || 'Sin Email'}</p>
                                                            <p className="text-[10px] font-mono text-muted/40 mt-1 uppercase tracking-tighter">{user.username || 'anon-user'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex justify-center">
                                                        {user.verified ? (
                                                            <div 
                                                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-[8px] font-black uppercase cursor-pointer hover:bg-accent/20 transition-all"
                                                                onClick={() => toggleVerification(user)}
                                                            >
                                                                <UserCheck className="w-3 h-3" /> Verificado
                                                            </div>
                                                        ) : (
                                                            <div 
                                                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] font-black uppercase cursor-pointer hover:bg-red-500/20 transition-all"
                                                                onClick={() => toggleVerification(user)}
                                                            >
                                                                <UserX className="w-3 h-3" /> Pendiente
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="text-[10px] text-muted font-mono bg-white/5 py-1 px-3 rounded-lg border border-white/5 w-fit">
                                                        {new Date(user.created).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="p-6 px-10">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => handleResetPassword(user)}
                                                            className="p-3 rounded-xl hover:bg-white/10 text-muted hover:text-white transition-all shadow-sm"
                                                            title="Reset Password"
                                                        >
                                                            <Key className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                                                            className="p-3 rounded-xl hover:bg-white/10 text-muted hover:text-white transition-all"
                                                            title="Edit User"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteUser(user)}
                                                            className="p-3 rounded-xl hover:bg-red-500/10 text-muted hover:text-red-500 transition-all"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="h-[400px] flex flex-col items-center justify-center p-20 opacity-20 text-center space-y-4">
                                    <Users className="w-16 h-16" />
                                    <div>
                                        <p className="font-black uppercase tracking-widest text-xs">Sin registros de usuarios</p>
                                        <p className="text-[10px] font-medium mt-1">Los nuevos registros aparecerán aquí automáticamente.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            {isModalOpen && (
                <RecordModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    collection={userCollection}
                    record={selectedUser}
                    onSuccess={loadUsers}
                />
            )}
        </div>
    )
}

function StatCard({ label, value, icon: Icon, color }: any) {
    return (
        <div className="bg-card/20 border border-white/5 rounded-3xl p-8 flex items-center justify-between group hover:bg-card/40 hover:border-accent/20 transition-all cursor-default overflow-hidden relative shadow-lg">
            <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.08] transition-all group-hover:scale-125 group-hover:rotate-12 duration-700">
                <Icon size={160} />
            </div>
            <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-black uppercase text-muted tracking-[0.2em]">{label}</p>
                <p className={cn("text-4xl font-black", color)}>{value}</p>
            </div>
            <div className={cn("p-5 rounded-[1.5rem] bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-white/[0.08] transition-all duration-500 shadow-inner", color)}>
                <Icon className="w-7 h-7" />
            </div>
        </div>
    )
}
