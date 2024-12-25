import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client";
import path from "path";
import { promises as fs } from "fs";
import SuperJSON from "superjson";

export const POST = async (request: NextRequest) => {
    // Получение данных
    const formData = await request.formData();

    const id = formData.get("id");
    const title = formData.get("title");
    const isFeatured = formData.get("isFeatured");
    const markdown = formData.get("markdown");
    const ingredients_id = formData.get("ingredients_id");
    const image = formData.get("image");

    const parsed_data = {
      id:                 id                  ?   SuperJSON.parse<bigint>(id as string)                   : null,
      title:              title               ?   title as string                                         : null,
      isFeatured:         isFeatured          ?   SuperJSON.parse<boolean>(isFeatured as string)          : null,
      markdown:           markdown            ?   markdown as string                                      : null,
      ingredients_id:     ingredients_id      ?   SuperJSON.parse<bigint[]>(ingredients_id as string)     : null,
      image:              image               ?   SuperJSON.parse<File>(image as string)                  : null,
    };

    // Response - Error
    if (!parsed_data.id) {
      return NextResponse.json(null, {status: 500});
    }

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

    const data: any = {};

    if (parsed_data.title) {
      data.title = parsed_data.title;
    }
    if (parsed_data.isFeatured) {
      data.isFeatured = parsed_data.isFeatured;
    }
    if (parsed_data.markdown) {
      data.markdown = parsed_data.markdown;
    }
    if (image_path) {
      data.image = image_path;
    }

    const new_cocktail = await prisma.cocktail.update({
        where: {
            id: parsed_data.id,
        },
        data: data,
    });
    
    await prisma.cocktail_ingredient.deleteMany({
        where: {
          id_cocktail: new_cocktail.id,
          NOT: {
            id_ingredient: {
              in: parsed_data.ingredients_id,
            },
          },
        },
    });

    if (parsed_data.ingredients_id){
      const existingIngredients = await prisma.cocktail_ingredient.findMany({
        where: {
          id_cocktail: new_cocktail.id,
        },
      });
  
      const existingIngredientIds = existingIngredients.map((item) => item.id_ingredient);
      const newIngredients = parsed_data.ingredients_id.filter((id: bigint) => !existingIngredientIds.includes(id));

      await prisma.cocktail_ingredient.createMany({
        data: newIngredients.map((item: bigint) => ({
          id_cocktail: new_cocktail.id,
          id_ingredient: item
        })),
      });
    }

    await prisma.$disconnect();

    // Response - success
    
    return NextResponse.json({status: "200"});  
};