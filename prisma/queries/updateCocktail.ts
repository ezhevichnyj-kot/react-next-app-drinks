import { PrismaClient, cocktail } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateCocktail(cocktail: cocktail) {
    
    const isExist = await prisma.cocktail.findFirst({
        where: {
            id: cocktail.id
        }
    });

    if (isExist) {
        prisma.cocktail.update({
            where: { 
                id: cocktail.id,
            },
            data: {
                title: cocktail.title,
                isFeatured: cocktail.isFeatured,
                image: cocktail.image,
                markdown: cocktail.markdown
            }
        });

        return 0;
    }
    else {
        return 1;
    }
};
