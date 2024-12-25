import { PropsWithChildren } from "react";

export const ListView = ({children, ...props}: PropsWithChildren) => {
    return <div className="flex-wrap max-w-full justify-center max-w-full gap-4 flex p-x-auto" {...props}>{children}</div>;
};
