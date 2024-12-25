"use client";

import { useCallback, useEffect, useState } from "react";
import { IDrinkCardProps } from "./component.props";
import { StarSvg } from "@/assets";
import './style.css';
import { ingredient } from "@prisma/client";
import { fetchIngredients } from "@/shared/api/fetchIngredients";

// TODO: пофиксить маркированный список
// TODO: анимация нажатия звёздочки

export const DrinkCard = ({cocktail, onFeaturedChange}: IDrinkCardProps) => {

    const [isFeaturedState, setIsFeaturedState] = useState<boolean>(cocktail.isFeatured);

    // TODO вынести в отдельный контекст (потом мемоизировать функции)

    const [ingredientsState, setIngredientsState] = useState<ingredient[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchIngredients({ id_cocktail: Number(cocktail.id) });

            if (data) {
                setIngredientsState(data);
            }
            else {
                //return { message: "Не удалось совершить запрос!", status: 400 }
                // TODO: реализовать попап с ошибкой

                console.error("Не удалось совершить запрос!")
            }
        };

        fetchData();
    }, []);

    const handleChangeFeatured = useCallback(() => {
        setIsFeaturedState(prevState => !prevState);
        onFeaturedChange(!isFeaturedState);
    }, [isFeaturedState]);

    return (
        <div className="flex flex-col justify-center gap-y-2 w-40 h-card">
            <div className="flex relative">
                <img src={cocktail.image ? cocktail.image : "default.png"} className="w-full h-52 object-cover rounded-xl" />
                <button onClick={handleChangeFeatured} className="absolute top-0 right-0 m-2">
                    <StarSvg className="star" fill={isFeaturedState ? '#FFC700' : '#C1C1C1'}/>
                </button>
            </div>
            <p className="text-base font-bold text-ellipsis whitespace-wrap max-w-full">{cocktail.title}</p>
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