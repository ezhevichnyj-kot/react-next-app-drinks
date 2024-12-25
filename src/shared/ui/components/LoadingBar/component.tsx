import { ILoadingProps, Variant } from "./component.props";
import { twMerge } from "tailwind-merge";

// TODO: add animation

export const LoadingBar = ({ className, variant='banana', ...props }: ILoadingProps) => {
    return (
        <div 
            className={twMerge('bg-'.concat(variant), className)}
            {...props}
        />
    );
};