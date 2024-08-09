import React, { useState } from 'react'
import useSignup from '../hooks/useSignup';

const Signup = () => {

    const [userid, setUserid] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('employee');
    const [secret, setSecret] = useState('');
    const { signup, isLoading, error, success } = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();


        await signup(userid, password, name, userType, secret, confirmPassword);
        setUserid('');
        setPassword('');
        setName('');
        setSecret('');
        setConfirmPassword('');
    }

    return (
        <div className='signup-container'>
            <form className='signup' onSubmit={handleSubmit}>
                <h3>Sign up </h3>
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
                <label>Name:</label>
                <input
                    type='text'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                <label>Password:</label>
                <input
                    type='password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <label>Confirm Password:</label>
                <input
                    type='text'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                />
                {userType === 'admin' && <label>Secret key:</label>}
                {
                    userType === 'admin' &&
                    <input
                        type='text'
                        onChange={(e) => setSecret(e.target.value)}
                        value={secret}
                    />
                }
                <button disabled={isLoading}>Sign up</button>
                {error && <div className='error'>{error}</div>}
                {success && <div className='success'>{success}</div>}
            </form>
        </div>
    )
}

export default Signup