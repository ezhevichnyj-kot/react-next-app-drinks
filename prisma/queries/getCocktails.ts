import { PrismaClient, cocktail } from "@prisma/client";
import { ICocktailForm } from "@/shared";

const prisma = new PrismaClient();

export async function getCocktails({cocktailProps, ingredients}: ICocktailForm): Promise<cocktail[]> {

    const where: any = {};
    
    if (cocktailProps) {
        if (cocktailProps.id) {
            where.title = cocktailProps.id;
        };
    
        if (cocktailProps.title) {
            where.title = cocktailProps.title;
        };
    
        if (cocktailProps.isFeatured) {
            where.isFeatured = cocktailProps.isFeatured;
        };
    };

    if (ingredients) {
        where.cocktail_ingredient = {
            some: {
                id_ingredient: {
                    in: ingredients.map((ingredient) => ingredient.id)
                },
            },
        };
    };

    const cocktails = await prisma.cocktail.findMany({where: where});

    return cocktails;
}
