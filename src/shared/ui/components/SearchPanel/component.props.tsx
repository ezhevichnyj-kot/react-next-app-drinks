import { ingredient } from '@prisma/client';

export interface ISearchPanelProps {
    searchCallback: (title: string, ingredients: ingredient[]) => void,
    className?: string,
};
