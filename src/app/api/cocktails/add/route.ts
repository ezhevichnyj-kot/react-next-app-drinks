import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client";
import path from "path";
import { promises as fs } from "fs";

export const POST = async (request: NextRequest) => {
    // Получение данных
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const isFeatured = Boolean(formData.get("isFeatured"));
    const markdown = formData.get("markdown") as string;
    const ingredients_id = JSON.parse(formData.get("ingredients_id") as string);
    const image = formData.get("image") as File;

    // Сохранение изображения

    let image_path = null;
    
    if (image) {
        const dirName = path.join(process.cwd(), "public", "cocktails");
        await fs.mkdir(dirName, { recursive: true });

        const fileName = `${Date.now()}-${image.name}`;
        const filePath = path.join(dirName, fileName);

        const buffer = Buffer.from(await image.arrayBuffer());
        await fs.writeFile(filePath, buffer);

        image_path = `/cocktails/${fileName}`;
    }

    // Сохранение данных в БД
    const prisma = new PrismaClient();

    const new_cocktail = await prisma.cocktail.create({
        data: {
            title: title,
            isFeatured: isFeatured,
            markdown: markdown,
            image: image_path,
        }
    });

    await prisma.cocktail_ingredient.createMany({
        data: ingredients_id.map((item: number) => ({
            id_cocktail: new_cocktail.id,
            id_ingredient: item
        })),
    });

    await prisma.$disconnect();

    // Редирект на страницу просмотра

    return NextResponse.json({id: Number(new_cocktail.id), status: "200"});  
};