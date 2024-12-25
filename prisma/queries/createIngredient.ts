import { ingredient, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export async function createIngredient(title: string) {

    const isExist = await prisma.ingredient.findFirst({
        where: {
            title: title
        }
    });

    if (!isExist) {
        prisma.ingredient.create({
            data: {
                title: title
            }
        });
        // TODO вызов ошибки вместо передачи числа
        return 0;
    }
    else {
        return 1;
    };
};
