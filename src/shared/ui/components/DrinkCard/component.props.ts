import { cocktail } from "@prisma/client"

export interface IDrinkCardProps {
    cocktail: cocktail,
    onFeaturedChange: (new_value: boolean) => void,
};
