import { useContext } from 'react';
import { ProjectsContext } from '../context/ProjectsContext';

export const useProjectsContext = () => {
    const context = useContext(ProjectsContext);

    if (!context) {
        throw Error("useProjectsContext must be used inside a ProjectContextProvider");
    }

    return context;
}