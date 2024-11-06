import { useState } from 'react';
// import { useAuthContext } from './useAuthContext';

const useSignup = () => {

    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    // const { dispatch } = useAuthContext();

    const signup = async (userid, password, name, userType, secret, confirmPassword) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        if (secret!=='' && secret !== 'NuclipProductionsAdmin') {
            setIsLoading(false);
            setError('Invalid secret key');
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }

        if (password !== confirmPassword) {
            setIsLoading(false);
            setError('Password not matched with Confirm Password');
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }

        const response = await fetch(`${process.env.REACT_APP_PROXY_URL}/register/` + userType, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid, password, name })
        })

        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setSuccess(null);
            setError(json.error);
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
        if (response.ok) {
            setIsLoading(false);
            setError(null);
            setSuccess(json.message);
            const timer = setTimeout(() => {
                setSuccess(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }

    return ({ signup, isLoading, error, success });
}

export default useSignup

