"use client";

import { Container } from "@/shared";
import { cocktail, ingredient } from '@prisma/client';
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import { useDropzone } from "react-dropzone";
import { IconPlusSvg } from "@/assets";
import { useRouter } from "next/navigation";
import SuperJSON from "superjson";

const CreatePage = ({params}: {params: Promise<{id: string}>}) => {

    const router = useRouter();

    const [cocktailState, setCocktailState] = useState<cocktail>();
    const [ingredientsState, setIngredientsState] = useState<(ingredient & {inFilter: Boolean})[]>([]);
    const [titleState, setTitleState] = useState<string>(cocktailState?.title || "");
    const [markdownState, setMarkdownState] = useState<string>(cocktailState?.markdown || "");
    const [ingredientTitleState, setIngredientTitleState] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length) {
            setImageFile(acceptedFiles[0]);
        }
    };        
      
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: false,
    });

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

    const onSave = useCallback(async () => {
        try {
            const formData = new FormData();

            formData.append("title", (titleState !== "" ? titleState : cocktailState?.title) || "Без названия");
            formData.append("ingredients_id", SuperJSON.stringify(ingredientsState.filter((item) => item.inFilter).map((item) => item.id)));
            formData.append("markdown", (markdownState !== "" ? markdownState : cocktailState?.markdown) || "");
            if (imageFile) {
              formData.append("image", imageFile);
            }
    
            const response = await axios.post("/api/cocktails/add", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            if (response.status == 200) {
                router.push(`/view/${response.data.id}`);
            }
        } catch (error) {
            // TODO: Обработать ошибку
            console.error("Ошибка при сохранении:", error);
        }
    }, [cocktailState, ingredientsState, titleState, imageFile, markdownState]);

    return (
        <Container className="flex flex-col col-start-2 p-10 gap-6">
            {/* input cocktail.title */}
            <p className="text-xl">Название</p>
            <div className="rounded bg-black-glass p-0 w-2/4">
                <input 
                    className="h-8 bg-none bg-transparent focus:outline-none p-2 w-full"
                    placeholder="Без названия"
                    defaultValue={cocktailState?.title}
                    onChange={(e) => {setTitleState(e.target.value);}}
                />
            </div>

            <div className="flex flex-row gap-8">
                {/* input изображения */}
                <div className="flex min-w-max min-h-max">
                    <img 
                        src={cocktailState && cocktailState.image ? cocktailState.image : "/cocktails/default.png"}
                        className="absolute z-10 w-40 h-52 object-cover rounded-xl p-1"
                    />

                    <div className="absolute z-20 w-40 h-52 object-cover rounded-xl bg-black-glass"/>
                        
                    <div
                        {...getRootProps()}
                        className="z-30 w-40 h-52 border-dashed border-2 rounded-xl p-0 flex flex-col items-center justify-center"
                    >
                        <input {...getInputProps()} />
                        {imageFile ? (
                            <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Preview"
                                className="w-40 h-52 object-cover rounded-xl"
                            />
                        ) : (
                            <p className="text-white text-center">Перетащите изображение сюда или нажмите для выбора</p>
                        )}
                    </div>
                </div>
                
                {/* input ингредиентов */}
                <div className="flex flex-col gap-8 max-h-full w-full">
                    <p className="text-lg">Ингредиенты</p>

                    <Container className="grid grid-cols-[1fr_max-content] items-center rounded bg-black-glass p-0 w-2/4">
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

                    <ul className="list-disc list-inside text-sm font-thin flex flex-wrap gap-2">
                        {ingredientsState.filter(item => item.inFilter).map(item => (
                            <button 
                                key={item.id}
                                onClick={() => {removeIngredient(item.title)}}
                                className="p-1 px-4 bg-positive rounded-full text-black font-bold line-clamp-1 text-ellipsis whitespace-wrap"
                            >{item.title}</button>
                        ))}
                    </ul>
                </div>
            </div>

            {/* input markdown */}   
            <div className="flex flex-row min-h-max gap-8">
                <Container className="grid grid-cols-[1fr_max-content] items-center rounded bg-black-glass p-0 w-2/4">
                    <textarea
                        className="w-full h-full min-h-10 bg-none bg-transparent focus:outline-none p-2 col-start-1"
                        placeholder={cocktailState?.markdown || ""}
                        onChange={(e) => setMarkdownState(e.target.value)}
                    />
                </Container>
                <Container className="grid grid-cols-[1fr_max-content] items-center rounded bg-black-glass p-2 w-2/4">
                    {/* TODO не работает на клиенте (markdown кастрированный) */}
                    <Markdown className="h-full">{markdownState != "" ? markdownState : cocktailState?.markdown}</Markdown>
                </Container>
            </div>
                    
            <button className="rounded bg-black-glass p-2" onClick={onSave}>Сохранить</button>
        </Container>
    );
};

export default CreatePage;
