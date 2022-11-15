import {AppState} from "@redux/reducers";
import {useSelector} from "react-redux";

export const useSelectorTyped = <T>(selector: (state: AppState) => T): T => {
    return useSelector(selector);
};
