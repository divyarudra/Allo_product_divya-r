import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {

  const body =
    await req.json();

  const inventory =
    await prisma.inventory.findFirst({

      where: {
        productId:
          body.productId,
      },
    });

  if (!inventory) {

    return NextResponse.json(
      {
        error:
          "Inventory not found",
      },

      {
        status: 404,
      }
    );
  }

  const available =
    inventory.totalUnits -
    inventory.reservedUnits;

  if (available < body.quantity) {

    return NextResponse.json(
      {
        error:
          "Not enough stock",
      },

      {
        status: 400,
      }
    );
  }

  await prisma.inventory.update({

    where: {
      id: inventory.id,
    },

    data: {
      reservedUnits: {
        increment:
          body.quantity,
      },
    },
  });

  const reservation =
    await prisma.reservation.create({

      data: {
        productId:
          body.productId,

        quantity:
          body.quantity,

        status:
          "PENDING",

        expiresAt:
          new Date(
            Date.now() +
            5 * 60 * 1000
          ),
      },
    });

  return NextResponse.json(
    reservation
  );
}
