import { NextResponse, NextRequest } from "next/server"
import { createIngredient } from "@prisma/queries";

export const POST = async (request: NextRequest) => {
    
    const body = await request.json();
    const { title } = body;

    const result: number = await createIngredient(title);

    if (result) {
        return NextResponse.json({ message: "Entity already exists!"}, { status: 400 });
    }
    else {
        return NextResponse.json({ message: "Entity added succesfully!"}, { status: 200 });
    };
};
