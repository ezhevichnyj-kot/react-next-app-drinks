import axios from "axios";
import { ROUTES } from "./routes";
import { ICocktailForm } from "@/shared";

export const fetchCocktails = async ({cocktailProps, ingredients}: ICocktailForm): Promise<any[] | null> => {
    try {
        const requestBody: any = {};

        if (cocktailProps) {
            requestBody.cocktailProps = cocktailProps;
        };

        if (ingredients) {
            requestBody.ingredients = ingredients;
        };
      
        const response = await axios.post(ROUTES.FETCH_COCKTAILS, requestBody);
        
        return JSON.parse(response.data.cocktails);
    } 
    catch (error) {
        console.error(error);
        return null;
    }
};
