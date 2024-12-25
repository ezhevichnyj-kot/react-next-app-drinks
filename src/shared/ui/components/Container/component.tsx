import { twMerge } from "tailwind-merge";
import { IContainerProps } from "./component.props";
import { PropsWithChildren } from "react";

export const Container = ({className, children, ...props}: PropsWithChildren & IContainerProps) => {
    return (
        <div className={twMerge('bg-black-glass backdrop-blur-md p-4 rounded-xl', className)} {...props}>
            {children}
        </div>
    );
};