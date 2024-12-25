import { cocktail, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export async function createCocktail({title, image, markdown}: cocktail) {
    const new_cocktail = await prisma.cocktail.create({
        data: {
            title: title,
            isFeatured: false,
            image: image,
            markdown: markdown,
        }
    });

    return new_cocktail;
};