import {getObjectData, getStringData} from "@utils/localStorage";
import {storageKeys} from "@constants";
import {isEmptyObject} from "../utils";

const useAuth =  () => {
    const userData = getObjectData(storageKeys.USER_DATA);
    
    return {
        user: userData,
        isAuthenticated: !!getStringData(storageKeys.USER_TOKEN) && !isEmptyObject(userData)
    }
}

export default useAuth;