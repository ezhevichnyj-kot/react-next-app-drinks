import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client";
import SuperJSON from "superjson";

export const POST = async (request: NextRequest) => {
    // Получение данных из формы
    const formData = await request.formData();

    const title = formData.get("title");
    const isFeatured = formData.get("isFeatured");
    const ingredients_id = formData.get("ingredients_id");

    const parsed_data = {
            title:              title               ?   title as string                                         : null,
            isFeatured:         isFeatured          ?   SuperJSON.parse<boolean>(isFeatured as string)          : null,
            ingredients_id:     ingredients_id      ?   SuperJSON.parse<bigint[]>(ingredients_id as string)     : null,
    };

    // Настройка фильтров
    const where: any = {};

    if (parsed_data.title) {
        where.title = {
            contains: parsed_data.title,
            mode: "insensitive",
        };
    }
    if (parsed_data.isFeatured) {
        where.isFeatured = parsed_data.isFeatured;
    }
    if (parsed_data.ingredients_id) {
        where.ingredients = {
            some: {
                id: {
                    in: parsed_data.ingredients_id,
                }
            }
        };
    }
    
    // Получение данных из БД
    const prisma = new PrismaClient();

    const cocktails = await prisma.cocktail.findMany({where: where});

    await prisma.$disconnect();

    // Преобразование и вывод
    const response = SuperJSON.stringify(cocktails);

    return NextResponse.json({response}, {status: 200});  
};
