import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ProjectsContextProvider } from './context/ProjectsContext';
import { EmployeesContextProvider } from './context/EmployeesContext';
import { AuthContextProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <EmployeesContextProvider>
        <ProjectsContextProvider>
          <App />
        </ProjectsContextProvider>
      </EmployeesContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
