import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client";
import { json } from "@/shared";

export const POST = async (request: NextRequest) => {
    // Получение данных из формы
    const formData = await request.formData();

    const id_cocktail = Number(formData.get("id_cocktail"));

    // Настройка фильтров
    const where: any = {};

    if (id_cocktail) {
        where.cocktail_ingredient = {
            some: {
                id_cocktail: id_cocktail,
            }
        };
    }

    // Получение данных из БД
    const prisma = new PrismaClient();

    const ingredients = await prisma.ingredient.findMany({where: where});

    await prisma.$disconnect();

    // Преобразование и вывод
    const response = json(ingredients);

    return NextResponse.json({response, status: 200 });  
};