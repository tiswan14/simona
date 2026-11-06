'use client'

import { useMemo, useState } from 'react'
import {
    ChevronDown,
    ChevronRight,
    CirclePlus,
    FileText,
    Folder,
    Layers3,
    Pencil,
    Plus,
    Search,
    Trash2,
    Wallet,
    X,
} from 'lucide-react'
import {
    budgetTree,
    type BudgetLevel,
    type BudgetNode,
} from '@/features/budget/data/budget-data'

const levelOrder: BudgetLevel[] = [
    'program',
    'kegiatan',
    'kelompok',
    'output',
    'komponen',
    'subkomponen',
    'akun',
    'detail',
]

const levelLabels: Record<BudgetLevel, string> = {
    program: 'Program',
    kegiatan: 'Kegiatan',
    kelompok: 'Kelompok',
    output: 'Output',
    komponen: 'Komponen',
    subkomponen: 'Subkomponen',
    akun: 'Akun belanja',
    detail: 'Detail belanja',
}

type FormValues = {
    code: string
    name: string
    paguAwal: string
    pagu: string
    hitungManual: string
    revisi: string
    sisa: string
    kodeIB: string
    volume: string
    satuan: string
    harga: string
}

type ModalState =
    | { mode: 'create'; level: BudgetLevel; parentId: string | null }
    | { mode: 'edit'; node: BudgetNode }
    | null

const emptyForm: FormValues = {
    code: '',
    name: '',
    paguAwal: '',
    pagu: '',
    hitungManual: '',
    revisi: '',
    sisa: '',
    kodeIB: '',
    volume: '',
    satuan: '',
    harga: '',
}

function formatRupiah(value: number | null | undefined) {
    if (value === null || value === undefined) return '—'

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value)
}

function parseNumber(value: string) {
    if (!value.trim()) return null

    const parsed = Number(value.replace(/[^\d-]/g, ''))
    return Number.isFinite(parsed) ? parsed : null
}

function findNode(nodes: BudgetNode[], id: string): BudgetNode | null {
    for (const node of nodes) {
        if (node.id === id) return node

        const found = findNode(node.children ?? [], id)
        if (found) return found
    }

    return null
}

function updateTree(
    nodes: BudgetNode[],
    id: string,
    updater: (node: BudgetNode) => BudgetNode,
): BudgetNode[] {
    return nodes.map((node) => {
        if (node.id === id) return updater(node)

        return {
            ...node,
            children: updateTree(node.children ?? [], id, updater),
        }
    })
}

function addToTree(
    nodes: BudgetNode[],
    parentId: string | null,
    newNode: BudgetNode,
): BudgetNode[] {
    if (!parentId) return [...nodes, newNode]

    return nodes.map((node) => {
        if (node.id === parentId) {
            return {
                ...node,
                children: [...(node.children ?? []), newNode],
            }
        }

        return {
            ...node,
            children: addToTree(node.children ?? [], parentId, newNode),
        }
    })
}

function deleteFromTree(nodes: BudgetNode[], id: string): BudgetNode[] {
    return nodes
        .filter((node) => node.id !== id)
        .map((node) => ({
            ...node,
            children: deleteFromTree(node.children ?? [], id),
        }))
}

function getNodeIcon(level: BudgetLevel) {
    if (level === 'detail') return FileText
    if (level === 'program' || level === 'kegiatan') return Layers3
    return Folder
}

function TreeItem({
    node,
    depth,
    selectedId,
    onSelect,
    onCreate,
    onEdit,
    onDelete,
}: {
    node: BudgetNode
    depth: number
    selectedId: string | null
    onSelect: (node: BudgetNode) => void
    onCreate: (node: BudgetNode) => void
    onEdit: (node: BudgetNode) => void
    onDelete: (node: BudgetNode) => void
}) {
    const [expanded, setExpanded] = useState(depth < 1)
    const children = node.children ?? []
    const hasChildren = children.length > 0
    const canAddChild = node.level !== 'detail'
    const Icon = getNodeIcon(node.level)

    return (
        <div>
            <div
                className={`group flex items-center gap-2 rounded-lg px-2 py-2 ${
                    selectedId === node.id ? 'bg-[#EAF1F5]' : 'hover:bg-slate-50'
                }`}
                style={{ paddingLeft: `${8 + depth * 20}px` }}
            >
                <button
                    type="button"
                    onClick={() => setExpanded((value) => !value)}
                    disabled={!hasChildren}
                    aria-label={expanded ? 'Tutup turunan' : 'Buka turunan'}
                    className="flex size-6 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-slate-200 disabled:invisible"
                >
                    {expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                </button>

                <button
                    type="button"
                    onClick={() => onSelect(node)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F4F7] text-[#18384D]">
                        <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-[#18384D]">{node.code}</span>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                                {levelLabels[node.level]}
                            </span>
                        </span>
                        <span className="mt-1 block break-words text-sm font-medium text-[#344653]">
                            {node.name}
                        </span>
                    </span>
                    <span className="hidden shrink-0 text-right text-xs font-semibold text-[#344653] md:block">
                        {formatRupiah(node.pagu)}
                    </span>
                </button>

                <div className="flex shrink-0 items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                    {canAddChild && (
                        <button
                            type="button"
                            title={`Tambah ${levelLabels[levelOrder[levelOrder.indexOf(node.level) + 1]]}`}
                            onClick={() => onCreate(node)}
                            className="rounded-md p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                        >
                            <Plus className="size-4" />
                        </button>
                    )}
                    <button
                        type="button"
                        title="Edit"
                        onClick={() => onEdit(node)}
                        className="rounded-md p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-700"
                    >
                        <Pencil className="size-4" />
                    </button>
                    <button
                        type="button"
                        title="Hapus"
                        onClick={() => onDelete(node)}
                        className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-700"
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>
            </div>

            {expanded && hasChildren && (
                <div>
                    {children.map((child) => (
                        <TreeItem
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            selectedId={selectedId}
                            onSelect={onSelect}
                            onCreate={onCreate}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

function Field({
    label,
    value,
    onChange,
    type = 'text',
    required = false,
}: {
    label: string
    value: string
    onChange: (value: string) => void
    type?: string
    required?: boolean
}) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-600">
                {label}{required && <span className="text-red-500"> *</span>}
            </span>
            <input
                type={type}
                value={value}
                required={required}
                onChange={(event) => onChange(event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-[#54748A] focus:ring-2 focus:ring-[#54748A]/10"
            />
        </label>
    )
}

export default function AnggaranPage() {
    const [tree, setTree] = useState<BudgetNode[]>(() => structuredClone(budgetTree))
    const [search, setSearch] = useState('')
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [modal, setModal] = useState<ModalState>(null)
    const [form, setForm] = useState<FormValues>(emptyForm)

    const allNodes = useMemo(() => {
        const result: BudgetNode[] = []
        const visit = (nodes: BudgetNode[]) => {
            nodes.forEach((node) => {
                result.push(node)
                visit(node.children ?? [])
            })
        }
        visit(tree)
        return result
    }, [tree])

    const selectedNode = selectedId ? findNode(tree, selectedId) : null
    const filteredTree = useMemo(() => {
        const keyword = search.trim().toLowerCase()
        if (!keyword) return tree

        const filter = (nodes: BudgetNode[]): BudgetNode[] =>
            nodes.reduce<BudgetNode[]>((result, node) => {
                const children = filter(node.children ?? [])
                const matches = node.code.toLowerCase().includes(keyword) ||
                    node.name.toLowerCase().includes(keyword)

                if (matches || children.length) {
                    result.push({ ...node, children })
                }

                return result
            }, [])

        return filter(tree)
    }, [tree, search])

    const openCreate = (parent: BudgetNode | null) => {
        const level = parent
            ? levelOrder[levelOrder.indexOf(parent.level) + 1]
            : 'program'

        if (!level) return

        setForm(emptyForm)
        setModal({
            mode: 'create',
            level,
            parentId: parent?.id ?? null,
        })
    }

    const openEdit = (node: BudgetNode) => {
        setForm({
            code: node.code,
            name: node.name,
            paguAwal: node.paguAwal?.toString() ?? '',
            pagu: node.pagu?.toString() ?? '',
            hitungManual: node.hitungManual?.toString() ?? '',
            revisi: node.revisi?.toString() ?? '',
            sisa: node.sisa?.toString() ?? '',
            kodeIB: node.kodeIB ?? '',
            volume: node.volume ?? '',
            satuan: node.satuan ?? '',
            harga: node.harga?.toString() ?? '',
        })
        setModal({ mode: 'edit', node })
    }

    const saveForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const values = {
            code: form.code.trim(),
            name: form.name.trim(),
            paguAwal: parseNumber(form.paguAwal),
            pagu: parseNumber(form.pagu),
            hitungManual: parseNumber(form.hitungManual),
            revisi: parseNumber(form.revisi),
            sisa: parseNumber(form.sisa),
            kodeIB: form.kodeIB.trim() || undefined,
            volume: form.volume.trim() || undefined,
            satuan: form.satuan.trim() || undefined,
            harga: parseNumber(form.harga),
        }

        if (!values.code || !values.name || !modal) return

        if (modal.mode === 'create') {
            const newNode: BudgetNode = {
                id: `manual-${crypto.randomUUID()}`,
                sourceLine: 0,
                level: modal.level,
                ...values,
                formula: null,
                validasi: null,
                children: [],
            }

            setTree((current) => addToTree(current, modal.parentId, newNode))
            setSelectedId(newNode.id)
        } else {
            setTree((current) =>
                updateTree(current, modal.node.id, (node) => ({
                    ...node,
                    ...values,
                })),
            )
            setSelectedId(modal.node.id)
        }

        setModal(null)
    }

    const handleDelete = (node: BudgetNode) => {
        const childCount = node.children?.length ?? 0
        const message = childCount
            ? `Data "${node.name}" memiliki ${childCount} turunan langsung. Hapus seluruh cabang beserta turunannya?`
            : `Hapus data "${node.name}"?`

        if (!window.confirm(message)) return

        setTree((current) => deleteFromTree(current, node.id))
        if (selectedId === node.id) setSelectedId(null)
    }

    const totalPagu = tree[0]?.pagu ?? 0

    return (
        <div className="space-y-6">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-[#B96C25]">Pengelolaan Keuangan</p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#243746]">Data Anggaran</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Prototype pengelolaan hierarki anggaran dengan CRUD pada seluruh tingkatan.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => openCreate(null)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#18384D] px-4 text-sm font-semibold text-white hover:bg-[#244D67]"
                >
                    <CirclePlus className="size-4" />
                    Tambah Program
                </button>
            </header>

            <section className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">Total pagu program</p>
                    <p className="mt-2 text-xl font-bold text-[#243746]">{formatRupiah(totalPagu)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">Jumlah seluruh data</p>
                    <p className="mt-2 text-xl font-bold text-[#243746]">{allNodes.length}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">Mode penyimpanan</p>
                    <p className="mt-2 text-xl font-bold text-amber-700">Prototype lokal</p>
                    <p className="mt-1 text-xs text-slate-400">Perubahan hilang saat halaman dimuat ulang</p>
                </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 p-5">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="font-semibold text-[#243746]">Struktur Anggaran</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Gunakan tombol tambah pada setiap baris untuk membuat tingkatan turunannya.
                            </p>
                        </div>
                        <span className="rounded-md bg-slate-100 px-3 py-1.5 text-xs text-slate-500">
                            {allNodes.length} data
                        </span>
                    </div>
                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cari kode atau nama..."
                            className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-[#54748A]"
                        />
                    </div>
                </div>

                <div className="grid xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="min-w-0 p-3 sm:p-5">
                        {filteredTree.length ? (
                            <div className="divide-y divide-slate-100">
                                {filteredTree.map((node) => (
                                    <TreeItem
                                        key={node.id}
                                        node={node}
                                        depth={0}
                                        selectedId={selectedId}
                                        onSelect={(item) => setSelectedId(item.id)}
                                        onCreate={openCreate}
                                        onEdit={openEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 text-center text-sm text-slate-500">Data tidak ditemukan</div>
                        )}
                    </div>

                    <aside className="border-t border-slate-200 bg-slate-50/70 p-5 xl:border-l xl:border-t-0">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-[#243746]">Detail Data</h3>
                            {selectedNode && (
                                <button type="button" onClick={() => setSelectedId(null)} className="rounded p-1 text-slate-400 hover:bg-slate-200">
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>
                        {selectedNode ? (
                            <div className="mt-4 space-y-3">
                                <div>
                                    <span className="text-xs font-semibold text-[#18384D]">{selectedNode.code}</span>
                                    <p className="mt-1 text-sm font-semibold text-[#344653]">{selectedNode.name}</p>
                                    <p className="mt-1 text-xs text-slate-500">{levelLabels[selectedNode.level]}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                                    {[
                                        ['Pagu awal', selectedNode.paguAwal],
                                        ['Pagu', selectedNode.pagu],
                                        ['Hitung manual', selectedNode.hitungManual],
                                        ['Revisi', selectedNode.revisi],
                                        ['Sisa', selectedNode.sisa],
                                        ['Harga', selectedNode.harga],
                                    ].map(([label, value]) => (
                                        <div key={String(label)} className="flex justify-between gap-3 border-b border-slate-100 py-2 last:border-0">
                                            <span className="text-slate-500">{label}</span>
                                            <span className="text-right font-medium text-slate-700">
                                                {typeof value === 'number' ? formatRupiah(value) : value ?? '—'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => openEdit(selectedNode)}
                                    className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-100"
                                >
                                    <Pencil className="size-4" />
                                    Edit data
                                </button>
                            </div>
                        ) : (
                            <div className="flex min-h-48 flex-col items-center justify-center text-center">
                                <Wallet className="size-8 text-slate-300" />
                                <p className="mt-3 text-sm font-medium text-slate-600">Pilih data anggaran</p>
                                <p className="mt-1 text-xs text-slate-400">Informasi data akan tampil di sini.</p>
                            </div>
                        )}
                    </aside>
                </div>
            </section>

            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4">
                    <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl">
                        <div className="flex items-start justify-between border-b border-slate-200 p-5">
                            <div>
                                <h2 className="text-lg font-semibold text-[#243746]">
                                    {modal.mode === 'create' ? 'Tambah' : 'Edit'} {modal.mode === 'create' ? levelLabels[modal.level] : levelLabels[modal.node.level]}
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    {modal.mode === 'create' ? 'Masukkan data tingkatan baru.' : 'Perbarui informasi data anggaran.'}
                                </p>
                            </div>
                            <button type="button" onClick={() => setModal(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                                <X className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={saveForm} className="space-y-5 p-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Kode" value={form.code} onChange={(value) => setForm((current) => ({ ...current, code: value }))} required />
                                <Field label="Nama" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} required />
                            </div>

                            <div>
                                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Informasi anggaran</p>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Pagu awal" type="number" value={form.paguAwal} onChange={(value) => setForm((current) => ({ ...current, paguAwal: value }))} />
                                    <Field label="Pagu" type="number" value={form.pagu} onChange={(value) => setForm((current) => ({ ...current, pagu: value }))} />
                                    <Field label="Hitung manual" type="number" value={form.hitungManual} onChange={(value) => setForm((current) => ({ ...current, hitungManual: value }))} />
                                    <Field label="Revisi" type="number" value={form.revisi} onChange={(value) => setForm((current) => ({ ...current, revisi: value }))} />
                                    <Field label="Sisa" type="number" value={form.sisa} onChange={(value) => setForm((current) => ({ ...current, sisa: value }))} />
                                </div>
                            </div>

                            {(modal.mode === 'edit' ? modal.node.level : modal.level) === 'detail' && (
                                <div>
                                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Rincian detail belanja</p>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field label="Kode IB" value={form.kodeIB} onChange={(value) => setForm((current) => ({ ...current, kodeIB: value }))} />
                                        <Field label="Volume" value={form.volume} onChange={(value) => setForm((current) => ({ ...current, volume: value }))} />
                                        <Field label="Satuan" value={form.satuan} onChange={(value) => setForm((current) => ({ ...current, satuan: value }))} />
                                        <Field label="Harga" type="number" value={form.harga} onChange={(value) => setForm((current) => ({ ...current, harga: value }))} />
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col-reverse justify-end gap-2 border-t border-slate-100 pt-4 sm:flex-row">
                                <button type="button" onClick={() => setModal(null)} className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50">
                                    Batal
                                </button>
                                <button type="submit" className="h-10 rounded-lg bg-[#18384D] px-5 text-sm font-semibold text-white hover:bg-[#244D67]">
                                    Simpan perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <p className="text-xs leading-5 text-slate-400">
                Prototype frontend: tambah, edit, dan hapus bekerja pada state halaman. Data belum tersimpan ke database dan akan kembali ke data awal setelah halaman dimuat ulang.
            </p>
        </div>
    )
}
