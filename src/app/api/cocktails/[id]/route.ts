import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client";
import { json } from "@/shared";

export const POST = async (request: NextRequest) => {
    // Получение данных
    const url = new URL(request.url);
    const id = Number(url.pathname.split("/").pop());

    // Настройка фильтров
    const where: any = { id: id};

    // Получение данных из БД
    const prisma = new PrismaClient();

    const cocktail = await prisma.cocktail.findFirst({where: where});

    await prisma.$disconnect();

    // Преобразование и вывод
    const response = json(cocktail);

    return NextResponse.json({response, status: 200 });  
};
