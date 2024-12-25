"use client";

import { Container } from '@/shared'
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { IHeaderProps } from './component.props';

// TODO: пофиксить анимацию
// TODO: заменить кнопки на нужные
// TODO: что-то сделать с IHeaderButton

export interface IHeaderButton {
    title: string,
    onClick: () => void,
}

const buttons: IHeaderButton[] = [{title: "Коллекция", onClick: () => {}},{title: "Миксер", onClick: () => {}}];

export const Header = ({className}: IHeaderProps) => {

    const [selectedItem, setSelectedItem] = useState<number>(1);

    return (
        <Container className={twMerge('w-full min-w-max h-max', className)}>
            <div className='grid grid-cols-[max-content_max-content_1fr] grid-rows-[max-content_max-content]'>
                {buttons.map((item, index) => (
                    <button 
                        className={twMerge('p-2 row-start-1', 'col-start-'.concat((index+1).toString()))}
                        key={index+1}
                        onClick={() => {setSelectedItem(index+1); item.onClick(); }}
                    >
                        {item.title}
                    </button>
                ))}
                <div className={twMerge('row-start-2 h-1 w-full bg-banana', 'col-start-'.concat((selectedItem).toString()))} />
            </div>
        </Container>
    )
};
