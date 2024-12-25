"use client";

import { useEffect, useState } from "react";
import { Container, ListView, DrinkCard, SearchPanel } from "@/shared";
import { cocktail } from "@prisma/client";
import axios from "axios";

const HomePage = () => {
    
    // TODO вынести в отдельный контекст (потом мемоизировать функции)
    const [cocktailsState, setCocktailsState] = useState<cocktail[]>([]);
    
    // get cocktails on load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = JSON.parse((await axios.post('/api/cocktails/get', {}, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })).data.response);

                setCocktailsState(response);
            }
            catch(error) {
                // TODO popup error
                console.error(error);
            }
        };
        
        fetchData();
    }, []);

    // TODO memoize this
    const searchCocktails = (title: string, ingredients_id: number[]) => {
        const fetchData = async () => {
            try {
                const formData = new FormData();

                formData.append("title", title);
                formData.append("ingredients_id", JSON.stringify(ingredients_id));

                const response = JSON.parse((await axios.post('/api/cocktails/get', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })).data.response);

                setCocktailsState(response);
            }
            catch(error) {
                // TODO popup error
                console.error(error);
            }
        };
        
        fetchData();
    };

    return (
        <>
            <SearchPanel className="col-start-1" searchCallback={searchCocktails}/>

            <Container className="flex col-start-2 p-10 ">
                <ListView>
                    { cocktailsState.map((item) => (
                        <DrinkCard 
                            key={item.id}
                            cocktail={item}
                            onFeaturedChange={() => {}}
                        />
                    ))}
                </ListView>
            </Container>
        </>
    );
}

export default HomePage;
