import ProfileLayout from "@components/Profile/ProfileLayout";
import Address from "@components/Profile/Address";
import { paths } from "@constants";
import useAuth from "@hooks/useAuth";
import NotAccess401 from "@hocs/NotAccess401";

const Index = () => {
    const { isAuthenticated } = useAuth();
    
    const breadcrumbsData = [
        {
            label: "Trang chủ",
            url: paths.home,
            active: false,
        },
        {
            label: "Hồ sơ",
            active: true,
        },
        {
            label: "Sổ địa chỉ",
            active: true,
        },
    ];

    return (
        <NotAccess401 condition={isAuthenticated} >
            <ProfileLayout breadcrumbsData={breadcrumbsData}>
                <Address />
            </ProfileLayout>
        </NotAccess401>
    );
};


export default Index;
