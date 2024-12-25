"use client";

import { Container } from "../Container";
import { useCallback, useEffect, useState } from "react";
import { ingredient } from "@prisma/client";
import { ISearchPanelProps } from "./component.props";
import { twMerge } from "tailwind-merge";
import { IconPlusSvg } from "@/assets";
import axios from "axios";

// TODO переделать на React hook form

export const SearchPanel = ({ className, searchCallback }: ISearchPanelProps) => {
    
    const [ingredientsState, setIngredientsState] = useState<(ingredient & {inFilter: boolean})[]>([]);
    const [titleState, setTitleState] = useState<string>("");
    const [ingredientTitleState, setIngredientTitleState] = useState<string>("");

    // get ingredients on load
    useEffect(() => {
        const fetchData = async () => {
            
            try {
                const response = JSON.parse((await axios.post('/api/ingredients/get', {}, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })).data.response);

                setIngredientsState(response.map((item: ingredient) => ({...item, inFilter: false})));
            }
            catch(error) {
                // TODO popup error
                console.error(error);
            }
        };
        
        fetchData();
    }, []);

    const addIngredient = () => {

        const found_item = ingredientsState.find(item => item.title == ingredientTitleState);

        if (found_item) {
            setIngredientsState(
                prevState => prevState.map(
                    item => item.id == found_item.id && item.inFilter == false 
                    ? {...item, inFilter: true } 
                    : item
                )
            );
        }
    };

    const removeIngredient = (title: string) => {

        const found_item = ingredientsState.find(item => item.title == title);

        if (found_item) {
            console.log("Change state");
            setIngredientsState(
                prevState => prevState.map(
                    item => item.id == found_item.id
                    ? {...item, inFilter: false } 
                    : item
                )
            );
        }
    };

    return (
        <Container className={twMerge("flex p-10 max-w-96 justify-self-end flex-col gap-4", className)}>
                <p>Название</p>
                <Container className="rounded bg-black-glass p-0">
                    <input 
                        className="h-8 bg-none bg-transparent focus:outline-none p-2"
                        placeholder="Поиск"
                        onChange={(e) => setTitleState(e.target.value)}
                    />
                </Container>

                <p>Ингредиенты</p>
                <Container className="grid grid-cols-[1fr_max-content] items-center rounded bg-black-glass p-0">
                    <input 
                        list="ingredients-list"
                        className="h-8 bg-none bg-transparent focus:outline-none p-2 col-start-1"
                        placeholder="Поиск"
                        onChange={(e) => setIngredientTitleState(e.target.value)}
                    />

                    <button className="col-start-2" onClick={addIngredient}>
                        <IconPlusSvg />
                    </button>
                </Container>
                
                <div className="flex flex-wrap gap-2">
                    {ingredientsState.filter(item => item.inFilter).map(item => (
                        <button 
                            key={item.id}
                            onClick={() => {removeIngredient(item.title)}}
                            className="p-1 px-4 bg-positive rounded-full text-black font-bold line-clamp-1 text-ellipsis whitespace-wrap"
                        >{item.title}</button>
                    ))}
                </div>

                <button
                    className="self-end w-full bg-positive text-black font-bold rounded py-1"
                    onClick={() => {searchCallback(titleState, ingredientsState.filter(item => item.inFilter).map(item => Number(item.id)));}}
                >Найти</button>
        </Container>
    );
};
