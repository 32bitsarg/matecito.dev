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
    Search
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import RecordModal from '@/components/project-admin/record-modal'

export default function UsersPage() {
    const { workspaceSlug, projectSlug } = useParams()
    const {
        records,
        loading,
        fetchRecords,
        getCollectionSchema,
        deleteRecord,
        updateRecord
    } = useProject()

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
        loadUsers()
    }, [])

    const handleResetPassword = async (user: any) => {
        // En PocketBase esto se hace via request-password-reset
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
        <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-accent/10 rounded-3xl text-accent border border-accent/20 shadow-lg shadow-accent/5">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Users & Accounts</h1>
                        <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mt-1">
                            Gestionando la base de usuarios de tu aplicación
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={loadUsers}
                        disabled={loading || isRefreshing}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 text-muted hover:text-white transition-all hover:bg-white/10"
                    >
                        <RefreshCw className={cn("w-5 h-5", (loading || isRefreshing) && "animate-spin")} />
                    </button>
                    <button
                        onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-accent text-background text-sm font-black hover:opacity-90 transition-all shadow-xl shadow-accent/10 uppercase tracking-widest"
                    >
                        <UserPlus className="w-4 h-4" />
                        Crear Usuario
                    </button>
                </div>
            </div>

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
            <div className="flex-1 bg-card/30 border border-border/50 rounded-[2.5rem] overflow-hidden flex flex-col backdrop-blur-sm">
                
                {/* Search Bar */}
                <div className="p-6 border-b border-white/5 bg-black/20 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
                        <input 
                            type="text"
                            placeholder="Buscar por email o username..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-border rounded-2xl pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-accent/40 transition-all"
                        />
                    </div>
                </div>

                {/* Users List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading && !isRefreshing ? (
                        <div className="h-full flex items-center justify-center">
                            <RefreshCw className="w-10 h-10 text-accent animate-spin opacity-20" />
                        </div>
                    ) : filteredUsers.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01]">
                                    <th className="p-6 text-[10px] font-black uppercase text-muted tracking-widest">Usuario</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-muted tracking-widest text-center">Estado</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-muted tracking-widest">Creado</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-muted tracking-widest text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/20 shadow-inner">
                                                    <span className="text-accent font-black uppercase text-lg">
                                                        {(user.email || user.username || '?')[0]}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white leading-tight">{user.email || 'Sin Email'}</p>
                                                    <p className="text-[10px] font-mono text-muted/50 mt-1 uppercase">{user.username || 'anon-user'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex justify-center">
                                                {user.verified ? (
                                                    <div 
                                                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] font-black uppercase cursor-pointer hover:bg-accent/20 transition-all"
                                                        onClick={() => toggleVerification(user)}
                                                    >
                                                        <UserCheck className="w-3 h-3" /> Verificado
                                                    </div>
                                                ) : (
                                                    <div 
                                                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase cursor-pointer hover:bg-red-500/20 transition-all"
                                                        onClick={() => toggleVerification(user)}
                                                    >
                                                        <UserX className="w-3 h-3" /> Pendiente
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="text-[10px] text-muted font-mono bg-white/5 py-1 px-2 rounded-lg border border-white/5 w-fit">
                                                {new Date(user.created).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleResetPassword(user)}
                                                    className="p-2.5 rounded-xl hover:bg-white/10 text-muted hover:text-white transition-all shadow-sm"
                                                    title="Reset Password"
                                                >
                                                    <Key className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                                                    className="p-2.5 rounded-xl hover:bg-white/10 text-muted hover:text-white transition-all"
                                                    title="Edit User"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteUser(user)}
                                                    className="p-2.5 rounded-xl hover:bg-red-500/10 text-muted hover:text-red-500 transition-all"
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
                        <div className="h-full flex flex-col items-center justify-center p-20 opacity-20">
                            <Users className="w-16 h-16 mb-4" />
                            <p className="font-black uppercase tracking-widest text-xs">No users found</p>
                        </div>
                    )}
                </div>
            </div>

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
        <div className="bg-card/30 border border-border/50 rounded-3xl p-6 flex items-center justify-between group hover:bg-white/[0.04] transition-all cursor-default overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-all group-hover:scale-110">
                <Icon size={120} />
            </div>
            <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-black uppercase text-muted tracking-widest">{label}</p>
                <p className={cn("text-4xl font-black", color)}>{value}</p>
            </div>
            <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-all", color)}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    )
}
