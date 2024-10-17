import { useState } from 'react';
import { useProjectsContext } from '../hooks/useProjectsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLocation } from 'react-router-dom'

function ProjectUpdate() {

    const { dispatch } = useProjectsContext();
    const { user } = useAuthContext();

    const location = useLocation();
    const { projectId } = location.state;

    const [link, setLink] = useState('');
    const [duration, setDuration] = useState(0);
    const [pkg, setPackage] = useState('');
    const [neeche, setNeeche] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError("You must be logged in");
            return
        }

        const project = { link, duration, pkg, neeche };
        const response = await fetch(`${process.env.REACT_APP_PROXY_URL}/user/auth/employee/` + user.userid + "/" + projectId, {
            method: "PATCH",
            body: JSON.stringify(project),
            headers: {
                "Content-Type": "application/json"
            },
            session: {
                authorization: user
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setSuccess(null);
            setError(json.error);
            setEmptyFields(json.emptyFields);
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
        if (response.ok) {
            setLink('');
            setDuration(0);
            setNeeche('');
            setPackage('');
            setError(null);
            setEmptyFields([]);
            setSuccess("Project updated successfully");
            const timer = setTimeout(() => {
                setSuccess(null);
            }, 5000);
            console.log(json);
            dispatch({ type: 'SET_PROJECTS', payload: json });
            return () => clearTimeout(timer);
        }
    }

    return (
        <form className='create' onSubmit={handleSubmit}>
            <h3>Update Project Details</h3>

            <label>Video Link:</label>
            <input
                type='text'
                onChange={(e) => setLink(e.target.value)}
                value={link}
                className={emptyFields.includes('link') ? 'error' : ''}
                style={{ width: '50%' }}
            />
            <label>Video Duration:</label>
            <input
                type="number"
                onChange={(e) => setDuration(e.target.value)}
                value={duration}
                className={emptyFields.includes('duration') ? 'error' : ''}
                style={{ width: '50%' }}
            />
            <label>Video Package:</label>
            <input
                type='text'
                onChange={(e) => setPackage(e.target.value)}
                value={pkg}
                className={emptyFields.includes('pkg') ? 'error' : ''}
                style={{ width: '50%' }}
            />
            <label>Video Neeche:</label>
            <input
                type='text'
                onChange={(e) => setNeeche(e.target.value)}
                value={neeche}
                className={emptyFields.includes('neeche') ? 'error' : ''}
                style={{ width: '50%' }}
            />

            <button>Update Project</button>
            {error && <div className='error' style={{ width: '50%' }}>{error}</div>}
            {success && <div className='success' style={{ width: '50%' }}>{success}</div>}
        </form>
    )
}

export default ProjectUpdate
