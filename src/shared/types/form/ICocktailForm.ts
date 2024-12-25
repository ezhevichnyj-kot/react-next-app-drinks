import { cocktail, ingredient } from "@prisma/client"

export interface ICocktailForm {
    cocktailProps?: Partial<Omit<cocktail, 'image' | 'markdown'>>,
    ingredients?: ingredient[]
};
