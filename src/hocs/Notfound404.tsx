import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ClientSideRender from "./ClientSideRender";
import NotFound from "@components/NotFound";

type IProps = {
    condition: boolean;
    children: any;
};

const Notfound404: React.FC<IProps> = ({ condition = true, children }) => {
    const [isFound, setIsFound] = useState<boolean>(true);

    useEffect(() => {
        if (!condition) {
            setIsFound(false);
        }
    }, [condition]);
    const renderContent = () => {
        return isFound ? children : <NotFound />;
    };

    return <ClientSideRender>{renderContent()}</ClientSideRender>;
};

export default Notfound404;
