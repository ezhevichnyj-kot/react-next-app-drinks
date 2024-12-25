import { useState } from "react";
import type { IPaginationProps } from "./component.props";

export const Pagination = ({startAt, pageCount, onChangeCallback}: IPaginationProps) => {
    const [pageState, setPageState] = useState<number>(1);
};
