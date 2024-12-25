import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client";
import path from "path";
import { promises as fs } from "fs";
import SuperJSON from "superjson";

export const POST = async (request: NextRequest) => {
    // Получение данных
    const formData = await request.formData();

    const title = formData.get("title");
    const isFeatured = formData.get("isFeatured");
    const markdown = formData.get("markdown");
    const ingredients_id = formData.get("ingredients_id");
    const image = formData.get("image");

    const parsed_data = {
        title:              title               ?   title as string                                         : "Без названия",
        isFeatured:         isFeatured          ?   SuperJSON.parse<boolean>(isFeatured as string)          : false,
        markdown:           markdown            ?   markdown as string                                      : "",
        ingredients_id:     ingredients_id      ?   SuperJSON.parse<bigint[]>(ingredients_id as string)     : null,
        image:              image               ?   SuperJSON.parse<File>(image as string)                  : null,
    };

    // Сохранение изображения
    let image_path = null;
    
    if (parsed_data.image) {
        const dirName = path.join(process.cwd(), "public", "cocktails");
        await fs.mkdir(dirName, { recursive: true });

        const fileName = `${Date.now()}-${parsed_data.image.name}`;
        const filePath = path.join(dirName, fileName);

        const buffer = Buffer.from(await parsed_data.image.arrayBuffer());
        await fs.writeFile(filePath, buffer);

        image_path = `/cocktails/${fileName}`;
    }

    // Сохранение данных в БД
    const prisma = new PrismaClient();

    const new_cocktail = await prisma.cocktail.create({
        data: {
            title: parsed_data.title,
            isFeatured: parsed_data.isFeatured,
            markdown: parsed_data.markdown,
            image: image_path,
        }
    });

    //Создание связей с ингредиентами
    if (parsed_data.ingredients_id) {
        await prisma.cocktail_ingredient.createMany({
            data: parsed_data.ingredients_id.map(item => ({
                id_cocktail: new_cocktail.id,
                id_ingredient: item
            })),
        });
    }

    await prisma.$disconnect();

    // Редирект на страницу просмотра
    const response = SuperJSON.stringify({id: new_cocktail.id});

    return NextResponse.json({response}, { status: 200 });  
};