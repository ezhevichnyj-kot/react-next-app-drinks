"use client";

import { Container } from "@/shared";
import { cocktail, ingredient } from '@prisma/client';
import { useEffect, useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import { useRouter } from "next/navigation";

const ViewPage = ({params}: {params: Promise<{id: string}>}) => {
    
    const router = useRouter();
    const [cocktailState, setCocktailState] = useState<cocktail>();
    const [ingredientsState, setIngredientsState] = useState<ingredient[]>([]);

    useEffect(() => {

        const fetchCocktail = async () => {
            try {
                const response = JSON.parse((await axios.post(`/api/cocktails/${(await params).id}`, {}, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })).data.response);

                setCocktailState(response);
            }
            catch(error) {
                // TODO popup error
                console.error(error);
            }
        };
        
        const fetchIngredients = async () => {
            try {
                const formData = new FormData();

                formData.append("id_cocktail", (await params).id);

                const response = JSON.parse((await axios.post('/api/ingredients/get', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })).data.response);

                setIngredientsState(response);
            }
            catch(error) {
                // TODO popup error
                console.error(error);
            }
        };
        
        fetchCocktail();
        fetchIngredients();
    }, []);

    return (
        <Container className="flex flex-col col-start-2 p-10 gap-8">
            <p className="text-xl">{cocktailState?.title}</p>
            <div className="flex flex-row gap-8">
                <img 
                    src={cocktailState && cocktailState.image ? cocktailState.image : "/cocktails/default.png"}
                    className="w-40 h-52 object-cover rounded-xl"
                />
                <div className="flex flex-col gap-8 max-h-full">
                    <p className="text-lg">Ингредиенты</p>
                    <ul className="list-disc list-inside text-sm font-thin flex flex-wrap gap-2">
                        {ingredientsState.map(item => (
                            <div 
                                key={item.id}
                                className="p-1 px-4 bg-positive rounded-full text-black font-bold line-clamp-1 text-ellipsis whitespace-wrap"
                            >{item.title}</div>
                        ))}
                    </ul>
                </div>
            </div>
            <Markdown>{cocktailState?.markdown}</Markdown>
            <button className="rounded bg-black-glass p-2" onClick={() => {router.push(`/update/${cocktailState?.id}`)}}>Редактировать</button>
        </Container>
    );
};

export default ViewPage;
