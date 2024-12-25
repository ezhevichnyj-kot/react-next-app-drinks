import axios from "axios";
import { ROUTES } from "./routes";
import { IIngredientForm } from "@/shared";

export const fetchIngredients = async ({id_cocktail}: IIngredientForm): Promise<any[] | null> => {
    try {
        const requestBody: any = {};

        if (id_cocktail) {
            requestBody.id_cocktail = id_cocktail;
        };
      
        const response = await axios.post(ROUTES.FETCH_INGREDIENTS, requestBody);
        
        return JSON.parse(response.data.ingredients);
    } 
    catch (error) {
        console.error(error);
        return null;
    }
};
