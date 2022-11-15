import Profile from "@components/Profile";
import Notfound404 from "@hocs/Notfound404";
import useDevices from "@hooks/useDevices";

const Information = () => {
    const { isMobile } = useDevices();
    return (
        <Notfound404 condition={!!isMobile}>
            <Profile />
        </Notfound404>
    )
};
        
export default Information;
