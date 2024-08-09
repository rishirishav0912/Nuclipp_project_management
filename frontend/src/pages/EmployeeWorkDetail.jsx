import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProjectsContext } from '../hooks/useProjectsContext';
import { useAuthContext } from '../hooks/useAuthContext'

//components
import ProjectDetails from '../components/ProjectDetails';
// import ProjectsForm from '../components/ProjectsForm';

function EmployeeWorkDetail(props) {

    const { projects, dispatch } = useProjectsContext();
    const { user } = useAuthContext();

    const location = useLocation();
    const { employeeId } = location.state;


    useEffect(() => {

        const fetchProjects = async () => {
            const response = await fetch("user/auth/admin/" + employeeId + "/projects", {
                method: 'GET',
                session: {
                    authorization: user
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
                <nav><button>Pay all</button></nav>
                {projects && projects.map((project) => {
                    return (<ProjectDetails key={project._id} project={project} />);
                })}
            </div>
            {/* <ProjectsForm /> */}
        </div>
    )
}

export default EmployeeWorkDetail