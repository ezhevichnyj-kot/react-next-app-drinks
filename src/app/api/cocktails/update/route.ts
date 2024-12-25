import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client";
import path from "path";
import { promises as fs } from "fs";

export const POST = async (request: NextRequest) => {
    // Получение данных
    const formData = await request.formData();

    const id = formData.get("id") as number | null;
    const title = formData.get("title") as string;
    const isFeatured = Boolean(formData.get("isFeatured"));
    const markdown = formData.get("markdown") as string;
    const ingredients_id = JSON.parse(formData.get("ingredients_id") as string);
    const image = formData.get("image") as File | null;

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

    const new_cocktail = await prisma.cocktail.update({
        where: {
            id: id!,
        },
        data: {
            title: title,
            isFeatured: isFeatured,
            markdown: markdown,
            image: image_path || undefined,
        }
    });
    
    await prisma.cocktail_ingredient.deleteMany({
        where: {
          id_cocktail: new_cocktail.id,
          NOT: {
            id_ingredient: {
              in: ingredients_id,
            },
          },
        },
    });

    const existingIngredients = await prisma.cocktail_ingredient.findMany({
        where: {
          id_cocktail: new_cocktail.id,
        },
      });
  
      const existingIngredientIds = existingIngredients.map((item) => Number(item.id_ingredient));
      const newIngredients = ingredients_id.filter((id: number) => !existingIngredientIds.includes(id));

    await prisma.cocktail_ingredient.createMany({
        data: newIngredients.map((item: number) => ({
            id_cocktail: new_cocktail.id,
            id_ingredient: item
        })),
    });

    await prisma.$disconnect();

    // Редирект на страницу просмотра
    
    return NextResponse.json({status: "200"});  
};