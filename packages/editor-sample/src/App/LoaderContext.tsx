import React, { createContext, useContext, useState, ReactNode} from "react";

interface LoaderContextType {
    isLoading: boolean;
    showLoader: () => void;
    hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function LoaderProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);

    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);

    return (
        <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
            {children}
        </LoaderContext.Provider>
    );
}

export function UseLoader() {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error("сломався (лоадер)");
    }
    return context;
}