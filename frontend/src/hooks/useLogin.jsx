import { useState } from 'react'
import { useAuthContext } from './useAuthContext';

const useLogin = () => {

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const login = async (userid, password, userType) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/user/login/' + userType, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userid, password })
        })

        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
        if (response.ok) {
            setIsLoading(false);
            setError(null);

            //save user to local storage
            localStorage.setItem('user', JSON.stringify(json));

            //update the auth context
            dispatch({ type: 'LOGIN', payload: json });

            setIsLoading(false);
        }
    }

    return ({ login, isLoading, error });
}

export default useLogin