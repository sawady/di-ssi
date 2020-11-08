import { createContext, useReducer } from "react";

const initialState = {
  did: "chau",
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { did: "hola" };
    case "logout":
      return { did: "chau" };
    default:
      return { did: "chau" };
  }
}

const store = createContext(initialState);
const { Provider } = store;

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
}

export { store, UserProvider };
