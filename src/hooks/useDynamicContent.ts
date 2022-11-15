import { useSelectorTyped } from "./useSelectorType";

const useDynamicContent = (key:string) => {
    const { contentCommons } = useSelectorTyped((state) => state.dynamic);
    const content = contentCommons?.find((content:any) => content.key === key);
    return {
        content,
        contenValue: content?.value
    }
}

export default useDynamicContent;