import {storageKeys, ssrMode, VmeApiUrl} from '../constants';
import apiConfig from '@/constants/apiConfig';
import {getStringData, removeItem, setStringData} from './localStorage';
import qs from 'qs';

export const callPostCookies = async () => {
	try {
		const accessToken = await getStringData(storageKeys.USER_TOKEN);
		const res = await fetch(`${VmeApiUrl}api/v1/cookies`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		});
		const data = await res.json();
		console.log('post api Cookies', data);
	} catch (err) {
		console.log(err);
	}
};

export const callGetCookies = async () => {
	try {
		const res = await fetch(`${VmeApiUrl}api/v1/cookies`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		});
		const data = await res.json();
		console.log('get api Cookies', data);
	} catch (err) {
		console.log(err);
	}
};

const refreshTokenFunc = async () => {
	try {
        const refreshToken = await getStringData(storageKeys.USER_REFRESH_TOKEN);
        const data = {
            refreshToken,
            grantType: 'RefreshToken',
        };
        const response = await fetch(`${VmeApiUrl}api/v1/auth`, {
			method: 'POST',
            body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
		});
        const responseData = await response.json();
        setStringData(storageKeys.USER_TOKEN, responseData?.data.accessToken);
        setStringData(storageKeys.USER_REFRESH_TOKEN, responseData?.data.refreshToken);
		callPostCookies();
		setTimeout(() => {
			callGetCookies();
		}, 3000);
		return window.location.reload();
	} catch {
		removeItem(storageKeys.USER_TOKEN);
        removeItem(storageKeys.USER_DATA);
        removeItem(storageKeys.USER_REFRESH_TOKEN);
        window.location.replace('/');
	}
};

const sendRequest = async (options:any, params: any = {}) => {
    let fullPath = options.path;
    let fetchRequest;
    let infoRequest;

    const userToken = await getStringData(storageKeys.USER_TOKEN);
    // fullPath !== apiConfig?.auth?.getOtp?.path
    // && fullPath !== apiConfig?.account?.login?.path
    if (userToken) {
        options.headers.Authorization = `Bearer ${userToken}`;
    }

    if (options.headers['Content-Type'] === 'multipart/form-data') {
        let headers = JSON.parse(JSON.stringify(options.headers));
        const formData = new FormData();
        const fileObjects = params.fileObjects;
        delete headers['Content-Type'];
        Object.keys(params).forEach(key => {
            if (key !== 'fileObjects')
                formData.append(key, params[key]);
        });
        if (fileObjects && Object.keys(fileObjects).length > 0) {
            Object.keys(fileObjects).forEach(key => {
                if (fileObjects[key].length > 0) {
                    fileObjects[key].forEach((file: string | Blob) => {
                        formData.append(key, file);
                    });
                } else if (fileObjects[key].constructor !== Array) {
                    formData.append(key, fileObjects[key]);
                }
            });
        }

        infoRequest = {
            method: options.method,
            headers,
            body: formData
        };
    } else {
        if (options.method === 'GET') {
            const mergeParams = {
                ...options.params,
                ...params,
            }

            if (Object.keys(mergeParams).length) {
                fullPath = `${fullPath}?${qs.stringify(mergeParams)}`
            }

            infoRequest = {
                method: options.method,
                headers: options.headers
            };
        } else {
            infoRequest = {
                method: options.method,
                headers: options.headers,
                body: JSON.stringify(params)
            };
        }
    }

    fetchRequest = await fetch(fullPath, infoRequest)
        .catch(error => {
            return Promise.reject(error);
            // Redirect to error page
            // window.location.replace(errorPath);
        });

    if (fetchRequest.status === 401 && userToken) {
        refreshTokenFunc();
        // removeItem(storageKeys.USER_TOKEN);
        // removeItem(storageKeys.USER_DATA);
        // window.location.replace('/');
    } else if (fetchRequest.status === 403) {
        window.location.replace('/forbidden');
    } else if (fetchRequest.status === 200 || fetchRequest.status === 201) {
        const responseData = await fetchRequest.json();
        return {success: true, responseData}
    } else if (fetchRequest.status === 401 || fetchRequest.status === 400 || fetchRequest.status === 404) {
        const responseData = await fetchRequest.json();
        return {success: false, responseData}
    } else {
        return Promise.reject(new Error('Internal Server Error'));
    }
}

const handleApiResponse = (result: { success: any; responseData: any; }, onCompleted: ((data: any) => void) , onError: ((error: any) => void)) => {
    const {success, responseData} = result;
    if (success){
        onCompleted(responseData);
    }
    else {
        onError(responseData);
    }
}

export {sendRequest, handleApiResponse}
