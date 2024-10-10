import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

//hooks
import useLogout from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

function Navbar() {

  const navigate = useNavigate();

  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [profilePhoto,setProfilePhoto] = useState('');
  const [qrImage,setQrImage] = useState('');

  useEffect(()=>{
  if (user && user.userType === 'employee') {

    const fetchEmployees = async () => {
      const response = await fetch(`${REACT_APP_PROXY_URL}/user/auth/admin/`, {
        method: 'GET',
        session: {
          authorization: user
        }
      });
      const json = await response.json();

      const { Profile_Photo, QR_Image } = (json.filter((employee) => employee.UserId === user.userid))[0];
      setProfilePhoto(Profile_Photo);
      setQrImage(QR_Image);
    }

    fetchEmployees();
  }},[user])

  const handleClick = () => {
    logout();
    setProfilePhoto('');
    setQrImage('');
  }

  return (
    <header>
      <div className='container'>
        <Link to="/">
          <h1>Hello Buddy</h1>
          {user && <h3>Home</h3>}
        </Link>
        <nav>{
          user && (<div>
            {user.userType === 'employee' && <img src={profilePhoto} alt="" height='100px' width='100px'></img>}

            {user.userType === 'employee' && <img src={qrImage} alt="" height='100px' width='100px' style={{ marginLeft: '10px' }}></img>}

            <span onClick={() => navigate("/profile")} style={{ cursor: 'pointer', marginLeft: '10px' }}>{user.userid}</span>

            <button onClick={handleClick}>Log out</button>
          </div>

          )
        }
          {
            !user && (
              <div>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </div>
            )
          }
        </nav>
      </div>
    </header>
  )
}

export default Navbar
