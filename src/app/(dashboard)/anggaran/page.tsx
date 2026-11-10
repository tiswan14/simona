'use client'

import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import {
    Pencil,
    RefreshCw,
    X,
} from 'lucide-react'

import type {
    BudgetLevel,
    BudgetNode,
} from '@/features/budget/types/budget'

import {
    addToTree,
    deleteFromTree,
    findNode,
    updateTree,
} from '@/features/budget/utils/budget-tree'

import { BudgetTreeItem } from '@/features/budget/components/budget-tree-item'

import {
    formatRupiah,
    parseNumber,
} from '@/features/budget/utils/budget-formatter'

import { BudgetHeader } from '@/features/budget/components/budget-header'
import { BudgetSummary } from '@/features/budget/components/budget-summary'

import {
    LEVEL_LABELS,
    getNextLevel,
} from '@/features/budget/constant/budget-level'

import { BudgetField } from '@/features/budget/components/budget-field'
import { BudgetEmptyState } from '@/features/budget/components/budget-empty-state'
import { BudgetTreeHeader } from '@/features/budget/components/budget-tree-header'
import { useBudget } from '@/features/budget/hooks/use-budget'

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
    | {
        mode: 'create'
        level: BudgetLevel
        parentId: string | null
    }
    | {
        mode: 'edit'
        node: BudgetNode
    }
    | null

const EMPTY_FORM: FormValues = {
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

function getFormValues(node: BudgetNode): FormValues {
    return {
        code: node.code,
        name: node.name,
        paguAwal: node.paguAwal?.toString() ?? '',
        pagu: node.pagu?.toString() ?? '',
        hitungManual: node.hitungManual?.toString() ?? '',
        revisi: node.revisi?.toString() ?? '',
        sisa: node.sisa?.toString() ?? '',
        kodeIB: node.kodeIB ?? '',
        volume: node.volume?.toString() ?? '',
        satuan: node.satuan ?? '',
        harga: node.harga?.toString() ?? '',
    }
}

function getFormPayload(form: FormValues) {
    return {
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
}

function filterBudgetTree(
    nodes: BudgetNode[],
    keyword: string,
): BudgetNode[] {
    if (!keyword) return nodes

    return nodes.reduce<BudgetNode[]>((result, node) => {
        const children = filterBudgetTree(
            node.children ?? [],
            keyword,
        )

        const matches =
            node.code.toLowerCase().includes(keyword) ||
            node.name.toLowerCase().includes(keyword)

        if (matches || children.length > 0) {
            result.push({
                ...node,
                children,
            })
        }

        return result
    }, [])
}

function countBudgetNodes(nodes: BudgetNode[]): number {
    return nodes.reduce(
        (total, node) =>
            total + 1 + countBudgetNodes(node.children ?? []),
        0,
    )
}

export default function AnggaranPage() {
    const {
        tree,
        setTree,
        loading,
        refreshing,
        error,
        allNodes,
        totalPagu,
        handleRefresh,
    } = useBudget()

    const [search, setSearch] = useState('')
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [modal, setModal] = useState<ModalState>(null)
    const [form, setForm] = useState<FormValues>(EMPTY_FORM)

    const selectedNode = useMemo(
        () => selectedId ? findNode(tree, selectedId) : null,
        [tree, selectedId],
    )

    const keyword = search.trim().toLowerCase()

    const filteredTree = useMemo(
        () => filterBudgetTree(tree, keyword),
        [tree, keyword],
    )

    const openCreate = (parent: BudgetNode | null) => {
        const level = parent
            ? getNextLevel(parent.level)
            : 'program'

        if (!level) return

        setForm(EMPTY_FORM)

        setModal({
            mode: 'create',
            level,
            parentId: parent?.id ?? null,
        })
    }

    const openEdit = (node: BudgetNode) => {
        setForm(getFormValues(node))

        setModal({
            mode: 'edit',
            node,
        })
    }

    const saveForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!modal) return

        const values = getFormPayload(form)

        if (!values.code || !values.name) return

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

            setTree((current) =>
                addToTree(current, modal.parentId, newNode),
            )

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
        const childCount = countBudgetNodes(
            node.children ?? [],
        )

        const message = childCount > 0
            ? `Data "${node.name}" memiliki ${childCount} data turunan. Hapus seluruh cabang beserta turunannya?`
            : `Hapus data "${node.name}"?`

        if (!window.confirm(message)) return

        setTree((current) =>
            deleteFromTree(current, node.id),
        )

        if (selectedId && findNode([node], selectedId)) {
            setSelectedId(null)
        }
    }

    const updateForm = (
        field: keyof FormValues,
        value: string,
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }))
    }

    if (loading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                    <RefreshCw className="size-4 animate-spin" />
                    Memuat data anggaran...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="font-semibold text-red-700">
                            Gagal memuat data anggaran
                        </p>

                        <p className="mt-1 text-sm text-red-600">
                            {error}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`size-3.5 ${refreshing ? 'animate-spin' : ''}`}
                        />
                        Coba lagi
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <BudgetHeader />

            <BudgetSummary
                totalPagu={totalPagu}
                allNodes={allNodes}
            />

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <BudgetTreeHeader
                    allNodes={allNodes}
                    search={search}
                    onSearchChange={setSearch}
                    onCreateProgram={() => openCreate(null)}
                />

                <div className="grid xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="min-w-0 p-3 sm:p-5">
                        {filteredTree.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {filteredTree.map((node) => (
                                    <BudgetTreeItem
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
                            <BudgetEmptyState
                                title={
                                    keyword
                                        ? 'Data tidak ditemukan'
                                        : 'Belum ada data anggaran'
                                }
                                description={
                                    keyword
                                        ? 'Coba gunakan kata kunci atau kode anggaran yang berbeda.'
                                        : 'Belum terdapat data anggaran pada periode ini.'
                                }
                            />
                        )}
                    </div>

                    <aside className="border-t border-slate-200 bg-slate-50/70 p-5 xl:border-l xl:border-t-0">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-[#243746]">
                                Detail Data
                            </h3>

                            {selectedNode && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedId(null)}
                                    aria-label="Tutup detail"
                                    className="rounded p-1 text-slate-400 hover:bg-slate-200"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>

                        {selectedNode ? (
                            <div className="mt-4 space-y-3">
                                <div>
                                    <span className="text-xs font-semibold text-[#18384D]">
                                        {selectedNode.code || 'Tanpa kode'}
                                    </span>

                                    <p className="mt-1 text-sm font-semibold text-[#344653]">
                                        {selectedNode.name}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {LEVEL_LABELS[selectedNode.level]}
                                    </p>
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
                                        <div
                                            key={String(label)}
                                            className="flex justify-between gap-3 border-b border-slate-100 py-2 last:border-0"
                                        >
                                            <span className="text-slate-500">
                                                {label}
                                            </span>

                                            <span className="text-right font-medium text-slate-700">
                                                {value === null || value === undefined
                                                    ? '—'
                                                    : formatRupiah(value as string | number)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {selectedNode.level === 'detail' && (
                                    <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Rincian detail belanja
                                        </p>

                                        {[
                                            ['Kode IB', selectedNode.kodeIB],
                                            ['Volume', selectedNode.volume],
                                            ['Satuan', selectedNode.satuan],
                                        ].map(([label, value]) => (
                                            <div
                                                key={String(label)}
                                                className="flex justify-between gap-3 border-b border-slate-100 py-2 last:border-0"
                                            >
                                                <span className="text-slate-500">
                                                    {label}
                                                </span>

                                                <span className="text-right font-medium text-slate-700">
                                                    {value ?? '—'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

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
                            <BudgetEmptyState
                                title="Pilih data anggaran"
                                description="Informasi lengkap data anggaran akan ditampilkan di sini."
                            />
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
                                    {modal.mode === 'create' ? 'Tambah' : 'Edit'}{' '}
                                    {modal.mode === 'create'
                                        ? LEVEL_LABELS[modal.level]
                                        : LEVEL_LABELS[modal.node.level]}
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    {modal.mode === 'create'
                                        ? 'Masukkan data tingkatan baru.'
                                        : 'Perbarui informasi data anggaran.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setModal(null)}
                                aria-label="Tutup modal"
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={saveForm}
                            className="space-y-5 p-5"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <BudgetField
                                    label="Kode"
                                    value={form.code}
                                    onChange={(value) => updateForm('code', value)}
                                    required
                                />

                                <BudgetField
                                    label="Nama"
                                    value={form.name}
                                    onChange={(value) => updateForm('name', value)}
                                    required
                                />
                            </div>

                            <div>
                                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Informasi anggaran
                                </p>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <BudgetField
                                        label="Pagu awal"
                                        type="number"
                                        value={form.paguAwal}
                                        onChange={(value) => updateForm('paguAwal', value)}
                                    />

                                    <BudgetField
                                        label="Pagu"
                                        type="number"
                                        value={form.pagu}
                                        onChange={(value) => updateForm('pagu', value)}
                                    />

                                    <BudgetField
                                        label="Hitung manual"
                                        type="number"
                                        value={form.hitungManual}
                                        onChange={(value) => updateForm('hitungManual', value)}
                                    />

                                    <BudgetField
                                        label="Revisi"
                                        type="number"
                                        value={form.revisi}
                                        onChange={(value) => updateForm('revisi', value)}
                                    />

                                    <BudgetField
                                        label="Sisa"
                                        type="number"
                                        value={form.sisa}
                                        onChange={(value) => updateForm('sisa', value)}
                                    />
                                </div>
                            </div>

                            {(modal.mode === 'edit'
                                ? modal.node.level
                                : modal.level) === 'detail' && (
                                    <div>
                                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Rincian detail belanja
                                        </p>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <BudgetField
                                                label="Kode IB"
                                                value={form.kodeIB}
                                                onChange={(value) => updateForm('kodeIB', value)}
                                            />

                                            <BudgetField
                                                label="Volume"
                                                value={form.volume}
                                                onChange={(value) => updateForm('volume', value)}
                                            />

                                            <BudgetField
                                                label="Satuan"
                                                value={form.satuan}
                                                onChange={(value) => updateForm('satuan', value)}
                                            />

                                            <BudgetField
                                                label="Harga"
                                                type="number"
                                                value={form.harga}
                                                onChange={(value) => updateForm('harga', value)}
                                            />
                                        </div>
                                    </div>
                                )}

                            <div className="flex flex-col-reverse justify-end gap-2 border-t border-slate-100 pt-4 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => setModal(null)}
                                    className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    className="h-10 rounded-lg bg-[#18384D] px-5 text-sm font-semibold text-white hover:bg-[#244D67]"
                                >
                                    Simpan perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}