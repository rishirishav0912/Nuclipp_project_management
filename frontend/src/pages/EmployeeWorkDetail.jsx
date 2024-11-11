import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProjectsContext } from '../hooks/useProjectsContext';
import { useAuthContext } from '../hooks/useAuthContext'

//components
import ProjectDetails from '../components/ProjectDetails';

function EmployeeWorkDetail(props) {

    const { projects, dispatch } = useProjectsContext();
    const { user } = useAuthContext();

    const location = useLocation();
    const { employeeId } = location.state;


    useEffect(() => {

        const fetchProjects = async () => {
            const response = await fetch(`${process.env.REACT_APP_PROXY_URL}/user/auth/admin/` + employeeId + "/projects", {
                method: 'GET',
                headers: {
                    "Authorization": user.token
                }
            })

            const json = await response.json();

            if (response.ok) {
                console.log(json);
                dispatch({ type: 'SET_PROJECTS', payload: json });
            }
        }

        if (user) {
            dispatch({ type: 'SET_PROJECTS', payload: null });
            fetchProjects();
        }

    }, [dispatch, user, employeeId]);

    return (
        <div className="home">
            <div className='workouts'>
                {projects && projects.map((project) => {
                    return (<ProjectDetails key={project._id} project={project} />);
                })}
            </div>
        </div>
    )
}

export default EmployeeWorkDetail
