import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

function useProfile() {

  const { user } = useAuthContext();

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const profile = async (newuserid, prevuserid, name, password, profilePhoto, mobile_number) => {

    if (!user) {
      setError("You must be logged in");
      return
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setEmptyFields([]);

    const profileDetail = { newuserid, prevuserid, name, password, profilePhoto, mobile_number }

    const response = await fetch(`${process.env.REACT_APP_PROXY_URL}/user/auth/` + user.userType + "/update", {
      method: 'PATCH',
      session: {
        authorization: user
      },
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileDetail)
    })

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setSuccess(null);
      // console.log(json.emptyFields,json.error);
      setEmptyFields(json.emptyFields);
      setError(json.error);
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (response.ok) {
      setIsLoading(false);
      setError(null);
      setEmptyFields([]);
      setSuccess(json.message);
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }
  return ({ profile, error, success, isLoading, emptyFields })
}

export default useProfile
