import { NextResponse, NextRequest } from "next/server"
import { getCocktails } from "@prisma/queries";
import { json } from "@/shared";

export const POST = async (request: NextRequest) => {
    
    const body = await request.json();
    const { cocktailProps, ingredients } = body;

    const cocktails = json(await getCocktails({cocktailProps, ingredients}));

    return NextResponse.json({"cocktails": cocktails}, { status: 200 });
};
