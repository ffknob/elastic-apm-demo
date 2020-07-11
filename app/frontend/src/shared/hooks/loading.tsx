import { useState, useCallback } from 'react';

const useLoading = () => {
    const [isLoading, setIsLoading] = useState(false);

    const loading = useCallback((isLoading: boolean) => {
        setIsLoading(isLoading);
    }, []);

    return { isLoading, loading };
};

export default useLoading;
