import ProfileLayout from "@components/Profile/ProfileLayout";
import ChangePassword from "@components/Profile/ChangePassword";
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
            url: paths.profile.index,
            active: false,
        },
        {
            label: "Đổi mật khẩu",
            active: true,
        },
    ];
    
    return (
        <NotAccess401 condition={isAuthenticated}>
            <ProfileLayout breadcrumbsData={breadcrumbsData}>
                <ChangePassword />
            </ProfileLayout>
        </NotAccess401>
    );
};


export default Index;
