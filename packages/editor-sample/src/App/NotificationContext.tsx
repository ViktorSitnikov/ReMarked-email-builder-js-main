import React, { createContext, useContext, useState, ReactNode} from "react";

interface NotificationContextType {
    message: string | undefined;
    showNotification: (message: string) => void;
    hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState<string | undefined>(undefined);

    const showNotification = (message: string) => setMessage(message);
    const hideNotification = () => setMessage(undefined);

    return (
        <NotificationContext.Provider value={{ message, showNotification, hideNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function UseNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("сломався (лоадер)");
    }
    return context;
}