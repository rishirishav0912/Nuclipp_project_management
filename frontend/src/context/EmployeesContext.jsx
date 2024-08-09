import { createContext, useReducer } from "react";

export const EmployeesContext = createContext();

export const employeesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_EMPLOYEES':
            return {
                employees: action.payload
            }

        default:
            return state
    }
}

export const EmployeesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(employeesReducer, {
        employees: null
    })

    return (
        <EmployeesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </EmployeesContext.Provider>
    )
}