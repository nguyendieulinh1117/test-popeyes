import React  from "react";

import Policy from "@@Policy";
import Notfound404 from "@hocs/Notfound404";
import { useRouter } from "next/router";
import useDynamicContent from "@hooks/useDynamicContent";
import ClientSideRender from "@hocs/ClientSideRender";

const PolicyPage = () => {
    const {query} = useRouter(); 
    const {contenValue} = useDynamicContent(query.key as string);
  
    return (
        <ClientSideRender>
            <Notfound404 condition={!!contenValue} >
                <Policy contenValue={contenValue}/>
            </Notfound404>
        </ClientSideRender>
    );
};

export default PolicyPage;
