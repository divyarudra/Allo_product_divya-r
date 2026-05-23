import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  const products =
    await prisma.inventory.findMany({

      include: {
        product: true,
      },
    });

  return NextResponse.json(
    products.map((item) => ({

      id: item.id,

      productName:
        item.product.name,

      totalStock:
        item.totalUnits,

      reservedStock:
        item.reservedUnits,

      availableStock:
        item.totalUnits -
        item.reservedUnits,
    }))
  );
}
