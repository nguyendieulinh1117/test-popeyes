import React, { createContext, useState } from 'react';

const ProfileContext = createContext<ContextValue | any>({});

type PropsType = {
    children: any;
}

type ContextValue = {
    errorNotification: boolean;
    activeNotification: boolean;
    Noti: any;
}

const ProfileProvider = ({children}: PropsType) =>{
    const [errorNotification, setErrorNotification] = useState(false);
    const [activeNotification, setActiveNotification] = useState(false);
    const [messageNotification, setMessageNotification] = useState('');

    const Noti = () => {
        const timeOut = 2000;
        const success = (message: string) => {
            setActiveNotification(true);
            setErrorNotification(false);
            setMessageNotification(message);
        }

        const error = (message: string) => {
            setActiveNotification(true);
            setErrorNotification(true);
            setMessageNotification(message);
        }

        setTimeout(()=>{
            setActiveNotification(false)
        }, timeOut)

        return {success, error}
    }

    const exportValues = {
        errorNotification,
        activeNotification,
        messageNotification,
        Noti
    } 
    
    return <ProfileContext.Provider value={exportValues}>
        {children}
    </ProfileContext.Provider>
}

export { ProfileContext, ProfileProvider };