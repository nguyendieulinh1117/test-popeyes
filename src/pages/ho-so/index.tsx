import Profile from "@components/Profile";
import NotAccess401 from "@hocs/NotAccess401";
import useAuth from "@hooks/useAuth";

const Index = () => {
    const { isAuthenticated } = useAuth();
    
    return (
        <NotAccess401 condition={isAuthenticated}>
            <Profile />
        </NotAccess401>
    )
};
        
export default Index;
