import { ssrMode } from "@constants";

type IProps = {
    children: any; 
};

const ClientSideRender = (props: IProps)=> {
    return (
        ssrMode ? <></>: props.children
    );
}

export default ClientSideRender;
