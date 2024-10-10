import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProjectsContext } from "../hooks/useProjectsContext";

//date-fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useAuthContext } from '../hooks/useAuthContext';

function ProjectDetails(props) {

    const navigate = useNavigate()
    const { dispatch } = useProjectsContext();
    const { user } = useAuthContext();

    const [projectTime , setProjectTime] = useState(formatDistanceToNow(new Date(props.project.createdAt), { addSuffix: true }));

    let employeeId = null;

    setInterval(()=>{
        setProjectTime(formatDistanceToNow(new Date(props.project.createdAt), { addSuffix: true }));
    },60000)

    const location = useLocation();
    if (location.state !== null) {
        employeeId = location.state.employeeId;
    }


    let url = "http://" + props.project.Link;

    const handleDelete = async () => {

        if (!user) {
            return
        }

        const response = await fetch(`${REACT_APP_PROXY_URL}/user/auth/employee/` + user.userid + "/" + props.project._id, {
            method: 'DELETE',
            session: {
                authorization: user
            }
        })
        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'DELETE_PROJECT', payload: json });
        }
    }


    const handlePayment = async () => {

        if (!user) {
            return
        }

        if (props.project.Payment_Status === 'Paid') {
            return
        }

        const project = {
            link: props.project.Link,
            duration: props.project.Duration,
            neeche: props.project.Neeche,
            pkg: props.project.Package,
            payment_status: 'Paid'
        }

        const response = await fetch(`${REACT_APP_PROXY_URL}/user/auth/admin/` + employeeId + "/projects/" + props.project._id, {
            method: 'PATCH',
            body: JSON.stringify(project),
            headers: {
                "Content-Type": "application/json"
            },
            session: {
                authorization: user
            }
        });

        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'SET_PROJECTS', payload: json });
        }

    }

    return (
        <div className='workout-details'>
            <h4>{projectTime}</h4>
            <p><strong>Link : </strong><a href={url} target="_blank" rel="noreferrer">{props.project.Link}</a></p>
            <p><strong>Duration : </strong>{props.project.Duration}</p>
            <p><strong>Neeche : </strong>{props.project.Neeche}</p>
            <p><strong>Package : </strong>{props.project.Package}</p>
            <p><strong>Cost : </strong>{props.project.Cost}</p>
            <p><strong>Payment_Status : </strong>{props.project.Payment_Status}</p>
            {
                user &&
                (
                    user.userType === 'employee' &&
                    props.project.Payment_Status === 'Unpaid' &&
                    <span className="material-symbols-outlined" onClick={handleDelete}>delete </span>
                )
            }
            {
                user &&
                (
                    user.userType === 'employee' && 
                    props.project.Payment_Status === 'Unpaid' &&
                    <span className="material-symbols-outlined"
                        style={{ marginRight: '45px' }}
                        onClick={() => navigate("/projectupdate", {
                            state: {
                                projectId: props.project._id
                            }
                        })} >edit </span>
                )
            }
            {
                user &&
                (
                    user.userType === 'admin' && <span className="material-symbols-outlined"
                        onClick={handlePayment} >payments</span>
                )
            }
        </div>
    )
}

export default ProjectDetails
