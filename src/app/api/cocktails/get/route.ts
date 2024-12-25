import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client";
import { json } from "@/shared";

export const POST = async (request: NextRequest) => {
    // Получение данных из формы
    const formData = await request.formData();

    const title = formData.get("title");
    const isFeatured = Boolean(formData.get("isFeatured"));
    const ingredients_id = JSON.parse(formData.get("ingredients_id") as string);

    // Настройка фильтров
    const where: any = {};

    if (title) {
        where.title = {
            contains: title,
            mode: "insensitive",
        };
    }
    if (isFeatured) {
        where.isFeatured = isFeatured;
    }
    if (ingredients_id && ingredients_id.length > 0) {
        where.ingredients = {
            some: {
                id: {
                    in: ingredients_id,
                }
            }
        };
    }

    // Получение данных из БД
    const prisma = new PrismaClient();

    const cocktails = await prisma.cocktail.findMany({where: where});

    await prisma.$disconnect();

    // Преобразование и вывод
    const response = json(cocktails);

    return NextResponse.json({response, status: 200 });  
};
