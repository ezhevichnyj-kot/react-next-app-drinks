"use client";

import { useCallback, useEffect, useState } from "react";
import { IDrinkCardProps } from "./component.props";
import { StarSvg } from "@/assets";
import './style.css';
import { ingredient } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";

// TODO: пофиксить маркированный список
// TODO: анимация нажатия звёздочки

export const DrinkCard = ({cocktail, onFeaturedChange}: IDrinkCardProps) => {

    const router = useRouter();
    const [isFeaturedState, setIsFeaturedState] = useState<boolean>(cocktail.isFeatured);

    // TODO вынести в отдельный контекст (потом мемоизировать функции)

    const [ingredientsState, setIngredientsState] = useState<ingredient[]>([]);
    
    // TODO вынести запрос на уровень страницы или отдельной функции
    useEffect(() => {
        const fetchData = async () => {
            try {
                const formData = new FormData();
                formData.append("id_cocktail", JSON.stringify(cocktail.id))
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

        fetchData();
    }, []);

    const handleChangeFeatured = useCallback(() => {
        setIsFeaturedState(prevState => !prevState);
        onFeaturedChange(!isFeaturedState);
    }, [isFeaturedState]);

    return (
        <div className="flex flex-col justify-center gap-y-2 w-40 h-card cursor-pointer" onClick={() => {router.push(`/view/${cocktail.id}`)}}>
            <div className="flex relative">
                <img src={cocktail.image ? cocktail.image : "/cocktails/default.png"} className="w-full h-52 object-cover rounded-xl" />
                <button onClick={(e) => {e.stopPropagation(); handleChangeFeatured();}} className="absolute top-0 right-0 m-2">
                    <StarSvg className="star" fill={isFeaturedState ? '#FFC700' : '#C1C1C1'}/>
                </button>
            </div>
            <div className="text-base font-bold text-ellipsis whitespace-wrap max-w-full">{cocktail.title}</div>
            <div className="w-full max-w-full overflow-hidden">
                <ul className="list-disc list-inside text-sm font-thin">
                    {ingredientsState.map((item) => (
                        <li key={item.id}>{item.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};