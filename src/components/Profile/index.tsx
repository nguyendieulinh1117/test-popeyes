import ProfileLayout from "@components/Profile/ProfileLayout";
import Information from "@components/Profile/Infomation";
import { paths } from "@constants";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "@redux/actions";
import { useSelectorTyped } from "@hooks/useSelectorType";
import { isEmptyObject } from "@utils";
import Notfound404 from "@hocs/NotAccess401";
const breadcrumbsData = [
    {
        label: 'Trang chủ',
        url: paths.home,
        active: false,
    },
    {
        label: 'Hồ sơ',
        active: true,
    },
];

const Index = () => {
    const dispatch = useDispatch();

    const { profile } = useSelectorTyped(state => state.auth);
    
    useEffect(()=>{
        dispatch(authActions.getProfile());
    }, []);
  
    return (
        <ProfileLayout breadcrumbsData={breadcrumbsData}>
            <Information profile = {profile}/>
        </ProfileLayout>
    );
};


export default Index;
