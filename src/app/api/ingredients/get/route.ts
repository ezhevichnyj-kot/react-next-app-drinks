import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client";
import SuperJSON from "superjson";

export const POST = async (request: NextRequest) => {
    // Получение данных из формы
    const formData = await request.formData();

    const id_cocktail = formData.get("id_cocktail");

    const parsed_data = {
        id_cocktail:    id_cocktail     ?   SuperJSON.parse<bigint>(id_cocktail as string)    :   null,
    };

    // Настройка фильтров
    const where: any = {};

    if (parsed_data.id_cocktail) {
        where.cocktail_ingredient = {
            some: {
                id_cocktail: parsed_data.id_cocktail,
            }
        };
    }

    // Получение данных из БД
    const prisma = new PrismaClient();

    const ingredients = await prisma.ingredient.findMany({where: where});

    await prisma.$disconnect();

    // Преобразование и вывод
    const response = SuperJSON.stringify(ingredients);

    return NextResponse.json({response}, {status: 200 });  
};