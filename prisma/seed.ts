
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const period = await prisma.budgetPeriod.upsert({
    where: {
      year: 2026,
    },
    update: {},
    create: {
      year: 2026,
      name: 'Tahun Anggaran 2026',
      status: 'ACTIVE',
    },
  })

  const existingItems = await prisma.budgetItem.count({
    where: {
      periodId: period.id,
    },
  })

  if (existingItems > 0) {
    console.log(`Seed dilewati. Sudah ada ${existingItems} data anggaran.`)
    return
  }

  await prisma.$transaction(async (tx) => {
    const createItem = (
      data: Omit<Prisma.BudgetItemUncheckedCreateInput, 'periodId'>,
    ) => tx.budgetItem.create({
      data: {
        ...data,
        periodId: period.id,
      },
    })

    // 1. Program
    const program = await createItem({
      level: 'PROGRAM',
      code: 'GG',
      name: 'Program Dukungan Manajemen',
      sortOrder: 1,
      initialBudget: 8000000n,
      currentBudget: 8000000n,
    })

    // 2. Kegiatan
    const kegiatan = await createItem({
      level: 'KEGIATAN',
      code: '2896',
      name: 'Pengelolaan Administrasi dan Layanan',
      parentId: program.id,
      sortOrder: 1,
      initialBudget: 8000000n,
      currentBudget: 8000000n,
    })

    // 3. Output
    const output = await createItem({
      level: 'OUTPUT',
      code: 'BMA',
      name: 'Layanan Dukungan Manajemen Internal',
      parentId: kegiatan.id,
      sortOrder: 1,
      initialBudget: 8000000n,
      currentBudget: 8000000n,
    })

    // 4. Komponen
    const komponen = await createItem({
      level: 'KOMPONEN',
      code: '004',
      name: 'Operasional Perkantoran',
      parentId: output.id,
      sortOrder: 1,
      initialBudget: 8000000n,
      currentBudget: 8000000n,
    })

    // 5. Subkomponen
    const subkomponen = await createItem({
      level: 'SUBKOMPONEN',
      code: '052',
      name: 'Pelaksanaan Kegiatan Operasional',
      parentId: komponen.id,
      sortOrder: 1,
      initialBudget: 8000000n,
      currentBudget: 8000000n,
    })

    // 6. Akun Belanja
    const akunBahan = await createItem({
      level: 'AKUN',
      code: '521211',
      name: 'Belanja Bahan',
      parentId: subkomponen.id,
      sortOrder: 1,
      initialBudget: 5000000n,
      currentBudget: 5000000n,
    })

    const akunPerjalanan = await createItem({
      level: 'AKUN',
      code: '524113',
      name: 'Belanja Perjalanan Dinas Dalam Kota',
      parentId: subkomponen.id,
      sortOrder: 2,
      initialBudget: 3000000n,
      currentBudget: 3000000n,
    })

    // 7. Detil Belanja
    await createItem({
      level: 'DETIL',
      code: '001',
      ibCode: 'IB-2026-001',
      name: 'Pengadaan ATK Perkantoran',
      parentId: akunBahan.id,
      sortOrder: 1,
      volume: 10,
      unit: 'Paket',
      unitPrice: 300000n,
      initialBudget: 3000000n,
      currentBudget: 3000000n,
      isValid: true,
    })

    await createItem({
      level: 'DETIL',
      code: '002',
      ibCode: 'IB-2026-002',
      name: 'Pengadaan Bahan Cetak',
      parentId: akunBahan.id,
      sortOrder: 2,
      volume: 5,
      unit: 'Paket',
      unitPrice: 400000n,
      initialBudget: 2000000n,
      currentBudget: 2000000n,
      isValid: true,
    })

    await createItem({
      level: 'DETIL',
      code: '001',
      ibCode: 'IB-2026-003',
      name: 'Transportasi Kegiatan Dalam Kota',
      parentId: akunPerjalanan.id,
      sortOrder: 1,
      volume: 6,
      unit: 'OH',
      unitPrice: 300000n,
      initialBudget: 1800000n,
      currentBudget: 1800000n,
      isValid: true,
    })

    await createItem({
      level: 'DETIL',
      code: '002',
      ibCode: 'IB-2026-004',
      name: 'Uang Harian Perjalanan Dinas',
      parentId: akunPerjalanan.id,
      sortOrder: 2,
      volume: 4,
      unit: 'OH',
      unitPrice: 300000n,
      initialBudget: 1200000n,
      currentBudget: 1200000n,
      isValid: true,
    })
  })

  console.log('Seed berhasil dijalankan.')
  console.log('Periode: 2026')
  console.log('Total data anggaran: 11')
  console.log('Total pagu: Rp8.000.000')
}

main()
  .catch((error) => {
    console.error('Seed gagal:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
