import { ingredient } from '@prisma/client';

export interface ISearchPanelProps {
    searchCallback: (title: string, ingredients_id: number[]) => void,
    className?: string,
};
