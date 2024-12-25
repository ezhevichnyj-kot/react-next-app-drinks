"use client";

import { useEffect, useState } from "react";
import { Container, ListView } from "@/shared";
import { DrinkCard } from "@/shared/ui/components/DrinkCard/component";
import { cocktail, ingredient } from "@prisma/client";
import { fetchCocktails } from "@/shared";
import { SearchPanel } from "@/shared/ui/components/SearchPanel";

const Home = () => {
    
    // TODO вынести в отдельный контекст (потом мемоизировать функции)
    const [cocktailsState, setCocktailsState] = useState<cocktail[]>([]);
    
    // get cocktails on load
    useEffect(() => {
        const fetchData = async () => {
            
            const data = await fetchCocktails({});
            
            if (data) {
                setCocktailsState(data);
            }
            else {
                //return { message: "Не удалось совершить запрос!", status: 400 }
                // TODO: реализовать попап с ошибкой
                
                console.error("Не удалось совершить запрос!")
            }
        };
        
        fetchData();
    }, []);

    // TODO memoize this
    const searchCocktails = (title: string, ingredients: ingredient[]) => {
        const fetchData = async () => {
            
            const data = await fetchCocktails({cocktailProps: {title: title}, ingredients: ingredients.length ? ingredients : undefined});
            
            if (data) {
                setCocktailsState(data);
            }
            else {
                //return { message: "Не удалось совершить запрос!", status: 400 }
                // TODO: реализовать попап с ошибкой
                
                console.error("Не удалось совершить запрос!")
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

export default Home;
