import { useState } from 'react';
import { useProjectsContext } from '../hooks/useProjectsContext';
import { useAuthContext } from '../hooks/useAuthContext';

function ProjectsForm() {
    const { dispatch } = useProjectsContext();
    const { user } = useAuthContext();

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
        const response = await fetch(`${process.env.REACT_APP_PROXY_URL}/user/auth/employee/` + user.userid, {
            method: "POST",
            body: JSON.stringify(project),
            headers: {
                "Content-Type": "application/json",
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
            setSuccess("Project added successfully");
            const timer = setTimeout(() => {
                setSuccess(null);
            }, 5000);
            console.log(json);
            dispatch({ type: 'CREATE_PROJECT', payload: json });
            return () => clearTimeout(timer);
        }
    }

    return (
        <form className='create' onSubmit={handleSubmit}>
            <h3>Add a New Project</h3>

            <label>Video Link:</label>
            <input
                type='text'
                onChange={(e) => setLink(e.target.value)}
                value={link}
                className={emptyFields.includes('link') ? 'error' : ''}
            />
            <label>Video Duration:</label>
            <input
                type="number"
                onChange={(e) => setDuration(e.target.value)}
                value={duration}
                className={emptyFields.includes('duration') ? 'error' : ''}
            />
            <label>Video Package:</label>
            <input
                type='text'
                onChange={(e) => setPackage(e.target.value)}
                value={pkg}
                className={emptyFields.includes('pkg') ? 'error' : ''}
            />
            <label>Video Neeche:</label>
            <input
                type='text'
                onChange={(e) => setNeeche(e.target.value)}
                value={neeche}
                className={emptyFields.includes('neeche') ? 'error' : ''}
            />

            <button>Add Project</button>
            {error && <div className='error'>{error}</div>}
            {success && <div className='success'>{success}</div>}
        </form>
    )
}

export default ProjectsForm
