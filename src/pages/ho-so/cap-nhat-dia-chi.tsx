import ProfileLayout from "@components/Profile/ProfileLayout";
import CreateOrUpdateAddress from "@components/Profile/Address/ChangeAddress";
import { paths } from "@constants";
import NotAccess401 from "@hocs/NotAccess401";
import useAuth from "@hooks/useAuth";

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
            label: "Chỉnh sửa địa chỉ",
            active: true,
        },
    ];

    return (
        <NotAccess401 condition={isAuthenticated}>
            <ProfileLayout breadcrumbsData={breadcrumbsData}>
                <CreateOrUpdateAddress isUpdate={true} />
            </ProfileLayout>
        </NotAccess401>
    )
};

export default Index;
