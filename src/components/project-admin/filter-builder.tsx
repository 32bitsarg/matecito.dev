'use client'

import { useState } from 'react'
import { X, Plus, Filter, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterBuilderProps {
    collection: any
    onApply: (filterString: string) => void
    onClose: () => void
}

export default function FilterBuilder({ collection, onApply, onClose }: FilterBuilderProps) {
    const [rules, setRules] = useState<any[]>([
        { field: collection.fields[0]?.name || 'id', operator: '=', value: '' }
    ])

    const operatorsByFieldType: any = {
        text: ['=', '!=', '~', '!~'],
        number: ['=', '!=', '>', '<', '>=', '<='],
        bool: ['=', '!='],
        date: ['>', '<', '>=', '<='],
        email: ['=', '!=', '~'],
        select: ['=', '!='],
        relation: ['=', '!=']
    }

    const operatorLabels: any = {
        '=': 'Es igual a',
        '!=': 'No es igual a',
        '~': 'Contiene',
        '!~': 'No contiene',
        '>': 'Mayor que',
        '<': 'Menor que',
        '>=': 'Mayor o igual',
        '<=': 'Menor o igual'
    }

    const addRule = () => {
        setRules([...rules, { field: collection.fields[0]?.name || 'id', operator: '=', value: '' }])
    }

    const removeRule = (index: number) => {
        setRules(rules.filter((_, i) => i !== index))
    }

    const updateRule = (index: number, updates: any) => {
        const newRules = [...rules]
        newRules[index] = { ...newRules[index], ...updates }
        setRules(newRules)
    }

    const handleApply = () => {
        const filterString = rules
            .filter(r => r.value !== '')
            .map(r => {
                const value = typeof r.value === 'string' ? `"${r.value}"` : r.value
                return `${r.field} ${r.operator} ${value}`
            })
            .join(' && ')

        onApply(filterString)
        onClose()
    }

    return (
        <div className="absolute right-0 top-12 z-50 w-96 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#3ECF8E]" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Filtros Avanzados</h3>
                </div>
                <button onClick={onClose} className="text-[#52525b] hover:text-white transition-colors underline-none">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {rules.map((rule, index) => {
                    const field = collection.fields.find((s: any) => s.name === rule.field) || { type: 'text' }
                    const operators = operatorsByFieldType[field.type] || ['=', '!=']

                    return (
                        <div key={index} className="space-y-2 p-3 bg-[#0c0c0c] rounded-xl border border-[#222222]">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-[#52525b]">Regla {index + 1}</span>
                                {rules.length > 1 && (
                                    <button onClick={() => removeRule(index)} className="text-red-500/50 hover:text-red-500 underline-none">
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>

                            <select
                                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                                value={rule.field}
                                onChange={(e) => updateRule(index, { field: e.target.value })}
                            >
                                <option value="id">ID</option>
                                {collection.fields.map((f: any) => (
                                    <option key={f.id} value={f.name}>{f.name}</option>
                                ))}
                            </select>

                            <div className="flex gap-2">
                                <select
                                    className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                                    value={rule.operator}
                                    onChange={(e) => updateRule(index, { operator: e.target.value })}
                                >
                                    {operators.map((op: string) => (
                                        <option key={op} value={op}>{operatorLabels[op] || op}</option>
                                    ))}
                                </select>

                                {field.type === 'bool' ? (
                                    <select
                                        className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                                        value={rule.value}
                                        onChange={(e) => updateRule(index, { value: e.target.value === 'true' })}
                                    >
                                        <option value="">Selecciona</option>
                                        <option value="true">Verdadero</option>
                                        <option value="false">Falso</option>
                                    </select>
                                ) : (
                                    <input
                                        type={field.type === 'number' ? 'number' : 'text'}
                                        placeholder="Valor..."
                                        className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                                        value={rule.value}
                                        onChange={(e) => updateRule(index, { value: e.target.value })}
                                    />
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <button
                    onClick={addRule}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-[#2a2a2a] text-[10px] font-bold text-[#52525b] hover:border-[#3ECF8E] hover:text-[#3ECF8E] transition-all underline-none"
                >
                    <Plus className="w-3 h-3" />
                    AÑADIR REGLA
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={() => { setRules([{ field: 'id', operator: '=', value: '' }]); onApply('') }}
                        className="flex-1 py-2 rounded-lg bg-[#2a2a2a]/50 text-white text-[10px] font-bold hover:bg-[#2a2a2a] transition-all underline-none"
                    >
                        LIMPIAR
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#3ECF8E] text-[#0f0f0f] text-[10px] font-bold hover:bg-[#34b27b] transition-all underline-none"
                    >
                        <Play className="w-3 h-3 fill-current" />
                        APLICAR
                    </button>
                </div>
            </div>
        </div>
    )
}
