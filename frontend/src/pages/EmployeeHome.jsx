import { useEffect } from "react";
import { useProjectsContext } from "../hooks/useProjectsContext";
import { useAuthContext } from "../hooks/useAuthContext";

//components
import ProjectDetails from "../components/ProjectDetails";
import ProjectsForm from "../components/ProjectsForm";

const EmployeeHome = () => {

  const { projects, dispatch } = useProjectsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch(`${REACT_APP_PROXY_URL}user/auth/` + user.userType + "/" + user.userid, {
        method: 'GET',
        session: {
          authorization: user
        }
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: 'SET_PROJECTS', payload: json });
      }
    }

    if (user) {
      fetchProjects();
    }

  }
    , [dispatch, user])

  return (
    <div className="home">
      <div className='workouts'>
        {projects && projects.map((project) => {
          return (<ProjectDetails key={project._id} project={project} />);
        })}
      </div>
     <ProjectsForm />
    </div>
  );
}

export default EmployeeHome;
