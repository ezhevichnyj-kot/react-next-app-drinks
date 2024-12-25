import { NextResponse, NextRequest } from "next/server"
import { getIngredients } from "@prisma/queries";
import { json } from "@/shared";

export const POST = async (request: NextRequest) => {
    
    const body = await request.json();
    const { id_cocktail } = body;

    const ingredients = json(await getIngredients({id_cocktail}));

    return NextResponse.json({"ingredients": ingredients}, { status: 200 });
};
