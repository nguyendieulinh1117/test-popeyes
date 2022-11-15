export const setObjectData = (key: string, data: any) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(data));
    }
}

export const getObjectData = (key: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const jsonData = window.localStorage.getItem(key);
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
}

export const setStringData = (key: string, value: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
    }
}

export const getStringData = (key: string): string | null => {
    if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
    }
    return '';
}

export const removeItem = (key: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
    }
}