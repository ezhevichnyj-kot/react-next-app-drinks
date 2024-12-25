import { cocktail, ingredient, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export async function createCocktail(cocktail: Omit<cocktail, "id">, ingredients: ingredient[]) {
    const new_cocktail = await prisma.cocktail.create({
        data: {
            title: cocktail.title!,
            isFeatured: false,
            image: cocktail.image,
            markdown: cocktail.markdown ? cocktail.markdown : "",
        }
    });

    ingredients.map(item => {
        prisma.cocktail_ingredient.create({
            data: {
                id_cocktail: new_cocktail.id,
                id_ingredient: item.id
            }
        });
    });

    return new_cocktail.id;
};
