"use client";

import { Container } from '@/shared'
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { IHeaderProps } from './component.props';
import { useRouter } from 'next/navigation';
// TODO: пофиксить анимацию
// TODO: заменить кнопки на нужные
// TODO: что-то сделать с IHeaderButton

export interface IHeaderButton {
    title: string,
    onClick: () => void,
}

export const Header = ({className}: IHeaderProps) => {

    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState<number>(1);
    // TODO блин, забыл исправить на передачу кнопок сверху, щас уже не имеет особого смысла, поэтому пока оставлю так - исправить
    const buttons: IHeaderButton[] = [{title: "Коллекция", onClick: () => {router.push("/add")}}]; // {title: "Миксер", onClick: () => {}}

    return (
        <Container className={twMerge('w-full min-w-max h-max', className)}>
            <div className='grid grid-cols-[max-content_max-content_1fr] grid-rows-[max-content_max-content]'>
                {buttons.map((item, index) => (
                    <button 
                        className={twMerge('p-2 row-start-1', 'col-start-'.concat((index+1).toString()))}
                        key={index+1}
                        onClick={() => {setSelectedItem(index+1); item.onClick(); router.push('/');}}
                    >
                        {item.title}
                    </button>
                ))}
                <div className={twMerge('row-start-2 h-1 w-full bg-banana', 'col-start-'.concat((selectedItem).toString()))} />
            </div>
        </Container>
    )
};
