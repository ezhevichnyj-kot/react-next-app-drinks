import { IIngredientForm } from "@/shared";
import { ingredient, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getIngredients({ id_cocktail }: IIngredientForm): Promise<ingredient[]> {
    
    const where: any = {};

    if (id_cocktail) {
        where.cocktail_ingredient = {
            some: {
                id_cocktail: id_cocktail,
            },
        };
    };

    const ingredients = await prisma.ingredient.findMany({ where: where });

    return ingredients;
};
