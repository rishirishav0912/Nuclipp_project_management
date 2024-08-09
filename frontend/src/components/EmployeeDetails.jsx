import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeDetails = (props) => {

  const navigate = useNavigate();
  const id = props.employee.UserId;

  return (
    <div className='workout-details' onClick={() => navigate('/detail', { state: { employeeId: id } })}>
      <img src={props.employee.Profile_Photo} alt='' height='150px' width='150px'></img>
      <img src={props.employee.QR_Image} alt='' height='150px' width='150px' style={{ marginLeft: '10px' }}></img>
      <h4>{id}</h4>
      <p><strong>Name : </strong>{props.employee.Name}</p>

    </div>
  )
}

export default EmployeeDetails;
