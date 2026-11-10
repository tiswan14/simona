
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

import { PARENT_LEVEL } from '@/lib/budget/constant'
import { buildBudgetHierarchy } from '@/lib/budget/hierarchy'
import { serializeBudgetItem } from '@/lib/budget/serializer'
import { createBudgetSchema } from '@/lib/validations/budget.schema'

import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 },
      )
    }

    const yearParam = request.nextUrl.searchParams.get('year')
    const year = yearParam === null ? undefined : Number(yearParam)

    if (
      year !== undefined &&
      (!Number.isInteger(year) || year < 2000 || year > 2100)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Parameter tahun tidak valid',
        },
        { status: 400 },
      )
    }

    const period = await prisma.budgetPeriod.findFirst({
      where: year !== undefined
        ? { year }
        : { status: 'ACTIVE' },
      orderBy: { year: 'desc' },
    })

    if (!period) {
      return NextResponse.json(
        {
          success: false,
          message: 'Periode anggaran tidak ditemukan',
        },
        { status: 404 },
      )
    }

    const items = await prisma.budgetItem.findMany({
      where: {
        periodId: period.id,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'asc' },
      ],
    })

    return NextResponse.json({
      success: true,
      message: 'Data anggaran berhasil diambil',
      data: {
        period: {
          id: period.id,
          year: period.year,
          name: period.name,
          status: period.status,
        },
        summary: {
          totalItems: items.length,
        },
        items: buildBudgetHierarchy(items),
      },
    })
  } catch (error) {
    console.error('[GET /api/anggaran]', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data anggaran',
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 },
      )
    }

    let body: unknown

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Format JSON tidak valid',
        },
        { status: 400 },
      )
    }

    const validation = createBudgetSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validasi data anggaran gagal',
          errors: validation.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 },
      )
    }

    const data = validation.data
    const expectedParentLevel = PARENT_LEVEL[data.level]

    const result = await prisma.$transaction(async (tx) => {
      const period = await tx.budgetPeriod.findUnique({
        where: {
          id: data.periodId,
        },
      })

      if (!period) {
        return {
          status: 404,
          body: {
            success: false,
            message: 'Periode anggaran tidak ditemukan',
          },
        }
      }

      if (data.parentId) {
        const parent = await tx.budgetItem.findUnique({
          where: {
            id: data.parentId,
          },
        })

        if (!parent) {
          return {
            status: 404,
            body: {
              success: false,
              message: 'Parent anggaran tidak ditemukan',
            },
          }
        }

        if (parent.periodId !== data.periodId) {
          return {
            status: 400,
            body: {
              success: false,
              message: 'Parent harus berasal dari periode anggaran yang sama',
            },
          }
        }

        if (parent.level !== expectedParentLevel) {
          return {
            status: 400,
            body: {
              success: false,
              message: `Parent harus memiliki level ${expectedParentLevel}`,
            },
          }
        }
      }

      const item = await tx.budgetItem.create({
        data: {
          periodId: data.periodId,
          parentId: data.parentId ?? null,
          level: data.level,
          code: data.code ?? null,
          ibCode: data.ibCode ?? null,
          name: data.name,
          sortOrder: data.sortOrder ?? 0,
          volume: data.volume ?? null,
          unit: data.unit ?? null,
          unitPrice: data.unitPrice ?? null,
          initialBudget: data.initialBudget ?? 0n,
          currentBudget:
            data.currentBudget ?? data.initialBudget ?? 0n,
          isValid: data.isValid ?? null,
          notes: data.notes ?? null,
        },
      })

      return {
        status: 201,
        body: {
          success: true,
          message: 'Data anggaran berhasil ditambahkan',
          data: serializeBudgetItem(item),
        },
      }
    })

    return NextResponse.json(result.body, {
      status: result.status,
    })
  } catch (error) {
    console.error('[POST /api/anggaran]', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat menambahkan data anggaran',
      },
      { status: 500 },
    )
  }
}
