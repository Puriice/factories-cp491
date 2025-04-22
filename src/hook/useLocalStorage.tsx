import { useDebugValue, useEffect, useState } from "react";

export default function useLocalStorage(
    key: string,
    defaultValue: string
): [string, React.Dispatch<React.SetStateAction<string>>] {
    const [value, setValue] = useState<string>(() => {
        const value = localStorage.getItem(key);

        if (value !== null) return value;

        localStorage.setItem(key, defaultValue);

        return defaultValue;
    });

    useEffect(() => {
        if (value === null) {
            localStorage.removeItem(key);
            return;
        }
        localStorage.setItem(key, value);
    }, [value, key]);

    useDebugValue({ key, value });

    return [value, setValue];
}
