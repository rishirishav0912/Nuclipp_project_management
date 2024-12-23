import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import useProfile from '../hooks/useProfile';

function UserProfile() {

    const { user } = useAuthContext();

    const [newuserid, setUserid] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    // const [qrImage, setQrImage] = useState('');
    const [mobile_number, setMobile_number] = useState('');
    const { profile, error, success, isLoading, emptyFields } = useProfile();


    const handlePhotoChange = (e) => {

        const file = e.target.files[0];
        const photoReader = new FileReader();
        photoReader.onloadend = () => {
            console.log(photoReader.result);
            setProfilePhoto(photoReader.result);
        }
        photoReader.readAsDataURL(file);
    }

    // const handleQRChange = (e) => {

    //     const file = e.target.files[0];
    //     const qrReader = new FileReader();
    //     qrReader.onloadend = () => {
    //         console.log(qrReader.result);
    //         setQrImage(qrReader.result);
    //     }
    //     qrReader.readAsDataURL(file);
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(profilePhoto);

        await profile(newuserid, user.userid, name, password, profilePhoto, mobile_number);
        setUserid('');
        setName('');
        setPassword('');
        setProfilePhoto('');
        setMobile_number('');
    }

    return (
        <div>
            <form className='create' onSubmit={handleSubmit}>
                <h3>Profile</h3>

                <label>User Id:</label>
                <input
                    type='text'
                    onChange={(e) => setUserid(e.target.value)}
                    value={newuserid}
                    className={emptyFields.includes('userid') ? 'error' : ''}
                    style={{ width: '50%' }}
                />
                <label>Password:</label>
                <input
                    type="text"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className={emptyFields.includes('password') ? 'error' : ''}
                    style={{ width: '50%' }}
                />
                <label>Name:</label>
                <input
                    type='text'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className={emptyFields.includes('name') ? 'error' : ''}
                    style={{ width: '50%' }}
                />
                <label>Profile Photo (JPEG): </label>
                <input
                    type='file'
                    accept="image/jpeg"
                    onChange={(e) => handlePhotoChange(e)}
                    value={profilePhoto.name}
                    style={{ width: '50%' }}
                />
                {
                    user && (
                        user.userType === 'employee' &&
                        <label>Mobile Number: </label>
                    )
                }
                {
                    user && (
                        user.userType === 'employee' &&
                        <input
                            type='text'
                            onChange={(e) => setMobile_number(e.target.value)}
                            value={mobile_number}
                            className={emptyFields.includes('mobile_number') ? 'error' : ''}
                            style={{ width: '50%' }}
                        />
                    )
                }
                <button disabled={isLoading}>Update Details</button>
                {error && <div className='error' style={{ width: '50%' }}>{error}</div>}
                {success && <div className='success' style={{ width: '50%' }}>{success}</div>}
            </form>
        </div>
    )
}

export default UserProfile;