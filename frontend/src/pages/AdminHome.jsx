import { useEffect } from 'react';
import { useEmployeesContext } from '../hooks/useEmployeesContext';
import { useAuthContext } from '../hooks/useAuthContext';

//components
import EmployeeDetails from '../components/EmployeeDetails';


const AdminHome = () => {
    const { employees, dispatch } = useEmployeesContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await fetch("/user/auth/" + user.userType + "/", {
                method: 'GET',
                session: {
                    authorization: user
                }
            });
            const json = await response.json();
            if (response.ok) {
                dispatch({ type: 'SET_EMPLOYEES', payload: json });
            }
        }
        fetchEmployees();
    }, [dispatch, user])

    return (
        <div className="home">
            <div className='workouts'>
                {employees && employees.map((employee) => {
                    return (<EmployeeDetails key={employee._id} employee={employee} />);
                })}
            </div>
        </div>
    )
}

export default AdminHome;