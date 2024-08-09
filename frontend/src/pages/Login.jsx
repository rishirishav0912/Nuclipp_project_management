import React, { useState } from 'react'
import useLogin from '../hooks/useLogin';

const Login = () => {

    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('employee');
    const { login, isLoading, error } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(userid, password, userType);
    }

    return (
        <div>
            <form className='login' onSubmit={handleSubmit}>
                <h3>Log in</h3>
                <span>Employee</span>
                <label className="switch">
                    <input type="checkbox" onChange={(e) => e.target.checked ? setUserType('admin') : setUserType('employee')} />
                    <span className="slider round"></span>
                </label>
                <span>Admin</span>

                <label>User Id:</label>
                <input
                    type='text'
                    onChange={(e) => setUserid(e.target.value)}
                    value={userid}
                />
                <label>Password:</label>
                <input
                    type='password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <button disabled={isLoading}>Log in</button>
                {error && <div className='error'>{error}</div>}
            </form>
        </div>
    )
}

export default Login