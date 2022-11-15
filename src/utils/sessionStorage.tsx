export const setObjectData = (key: string, data: any) => {
    if (typeof window !== undefined && window.sessionStorage) {
        window.sessionStorage.setItem(key, JSON.stringify(data));
    }
};

export const getObjectData = (key: string) => {
    if (typeof window !== undefined && window.sessionStorage) {
        const jsonData = window.sessionStorage.getItem(key);
        if (jsonData) {
            try {
                return JSON.parse(jsonData);
            } catch {
                return false;
            }
        }
        return false;
    }
    return false;
};

export const setStringData = (key: string, value: any) => {
    if (typeof window !== undefined && window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
    }
};

export const getStringData = (key: string) => {
    if (typeof window !== undefined && window.sessionStorage) {
        return window.sessionStorage.getItem(key);
    }
    return false;
};

export const removeItem = (key: string) => {
    if (typeof window !== undefined && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
    }
};
