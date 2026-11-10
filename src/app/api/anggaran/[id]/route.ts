
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

import { serializeBudgetItem } from '@/lib/budget/serializer'
import { updateBudgetSchema } from '@/lib/validations/budget.schema'

import { Prisma } from '@prisma/client'
import { NextResponse, type NextRequest } from 'next/server'

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status },
  )
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = await params

    if (!id?.trim()) {
      return errorResponse('ID anggaran tidak valid', 400)
    }

    let body: unknown

    try {
      body = await request.json()
    } catch {
      return errorResponse('Format JSON tidak valid', 400)
    }

    const validation = updateBudgetSchema.safeParse(body)

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

    const result = await prisma.$transaction(async (tx) => {
      const existingItem = await tx.budgetItem.findUnique({
        where: { id },
        select: {
          id: true,
          level: true,
        },
      })

      if (!existingItem) {
        return {
          status: 404,
          body: {
            success: false,
            message: 'Data anggaran tidak ditemukan',
          },
        }
      }

      const detailFields = [
        'volume',
        'unit',
        'unitPrice',
      ] as const

      const hasDetailFields = detailFields.some(
        (field) => data[field] !== undefined,
      )

      if (hasDetailFields && existingItem.level !== 'DETIL') {
        return {
          status: 400,
          body: {
            success: false,
            message: 'Volume, satuan, dan harga hanya dapat diubah pada DETIL',
          },
        }
      }

      const updateData: Prisma.BudgetItemUpdateInput = {}

      if (data.name !== undefined) {
        updateData.name = data.name
      }

      if (data.code !== undefined) {
        updateData.code = data.code
      }

      if (data.ibCode !== undefined) {
        updateData.ibCode = data.ibCode
      }

      if (data.sortOrder !== undefined) {
        updateData.sortOrder = data.sortOrder
      }

      if (data.volume !== undefined) {
        updateData.volume = data.volume
      }

      if (data.unit !== undefined) {
        updateData.unit = data.unit
      }

      if (data.unitPrice !== undefined) {
        updateData.unitPrice = data.unitPrice
      }

      if (data.initialBudget !== undefined) {
        updateData.initialBudget = data.initialBudget
      }

      if (data.currentBudget !== undefined) {
        updateData.currentBudget = data.currentBudget
      }

      if (data.formula !== undefined) {
        updateData.formula = data.formula
      }

      if (data.isValid !== undefined) {
        updateData.isValid = data.isValid
      }

      if (data.validationNote !== undefined) {
        updateData.validationNote = data.validationNote
      }

      if (data.notes !== undefined) {
        updateData.notes = data.notes
      }

      const updatedItem = await tx.budgetItem.update({
        where: { id },
        data: updateData,
      })

      return {
        status: 200,
        body: {
          success: true,
          message: 'Data anggaran berhasil diperbarui',
          data: serializeBudgetItem(updatedItem),
        },
      }
    })

    return NextResponse.json(result.body, {
      status: result.status,
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return errorResponse('Data anggaran tidak ditemukan', 404)
    }

    console.error('[PATCH /api/anggaran/:id]', error)

    return errorResponse(
      'Terjadi kesalahan saat memperbarui data anggaran',
      500,
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = await params

    if (!id?.trim()) {
      return errorResponse('ID anggaran tidak valid', 400)
    }

    const result = await prisma.$transaction(async (tx) => {
      const item = await tx.budgetItem.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          level: true,
          children: {
            select: { id: true },
          },
          revisionItems: {
            select: { id: true },
          },
        },
      })

      if (!item) {
        return {
          status: 404,
          body: {
            success: false,
            message: 'Data anggaran tidak ditemukan',
          },
        }
      }

      if (item.children.length > 0) {
        return {
          status: 409,
          body: {
            success: false,
            message: 'Data tidak dapat dihapus karena masih memiliki data turunan',
            data: {
              name: item.name,
              level: item.level,
              childrenCount: item.children.length,
            },
          },
        }
      }

      if (item.revisionItems.length > 0) {
        return {
          status: 409,
          body: {
            success: false,
            message: 'Data tidak dapat dihapus karena sudah tercatat dalam riwayat revisi',
            data: {
              name: item.name,
              level: item.level,
              revisionCount: item.revisionItems.length,
            },
          },
        }
      }

      await tx.budgetItem.delete({
        where: { id },
      })

      return {
        status: 200,
        body: {
          success: true,
          message: 'Data anggaran berhasil dihapus',
          data: {
            id: item.id,
            name: item.name,
            level: item.level,
          },
        },
      }
    })

    return NextResponse.json(result.body, {
      status: result.status,
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      if (error.code === 'P2025') {
        return errorResponse('Data anggaran tidak ditemukan', 404)
      }

      if (error.code === 'P2003') {
        return errorResponse(
          'Data tidak dapat dihapus karena masih digunakan oleh data lain',
          409,
        )
      }
    }

    console.error('[DELETE /api/anggaran/:id]', error)

    return errorResponse(
      'Terjadi kesalahan saat menghapus data anggaran',
      500,
    )
  }
}
