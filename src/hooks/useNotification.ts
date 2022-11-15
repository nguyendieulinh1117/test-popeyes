import {useAlert} from 'react-alert';

const useNotification = () => {
    const alert = useAlert();

    const showSuccess = (message: string) => {
        alert.removeAll();
        alert.success(message);
    }

    const showError = (message: string) => {
        alert.removeAll();
        alert.error(message);
    }

    return {
        showError,
        showSuccess
    }
}

export default useNotification;