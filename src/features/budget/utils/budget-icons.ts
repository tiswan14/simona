
import {
  FileText,
  Folder,
  FolderOpen,
  Layers,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

import type { BudgetLevel } from '../types/budget'

const NODE_ICONS: Record<string, LucideIcon> = {
  program: Folder,
  kegiatan: FolderOpen,
  kelompok: Layers,
  output: Layers,
  komponen: Folder,
  subkomponen: FolderOpen,
  akun: Wallet,
  detail: FileText,

  PROGRAM: Folder,
  KEGIATAN: FolderOpen,
  KRO: Layers,
  RO: Layers,
  KOMPONEN: Folder,
  SUBKOMPONEN: FolderOpen,
  AKUN: Wallet,
  DETIL: FileText,
}

export function getNodeIcon(level: BudgetLevel | string): LucideIcon {
  return NODE_ICONS[level] ?? FileText
}
