import { useEffect, useState } from "react";
import ClientSideRender from "./ClientSideRender";
import NotAccess from "@components/NotAccess";

type IProps = {
  condition: boolean;
  children: any;
};


const NotAccess401: React.FC<IProps> = ({condition = true, children})=> {
    const [ isFound, setIsFound ] = useState<boolean>(true)

    useEffect(() => {
        if(!condition){
            setIsFound(false)
        }
    }, []);
    const renderContent = () => {
       return ( isFound ? children : <NotAccess/> )
    }
  
    return (
      <ClientSideRender>
          {renderContent()}
      </ClientSideRender>
    );
}

export default NotAccess401;
