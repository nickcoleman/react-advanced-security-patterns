import React, { createContext, useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { FetchContext } from "./FetchContext";

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const history = useHistory();
  const fetchContext = useContext(FetchContext);

  const [authState, setAuthState] = useState({
    userInfo: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data } = await fetchContext.authAxios.get("/user-info");
        setAuthState({
          userInfo: data.user,
          isAuthenticated: true,
        });
      } catch (error) {
        setAuthState({
          userInfo: {},
          isAuthenticated: false,
        });
      }
    };
    getUserInfo();
  }, [fetchContext]);

  const setAuthInfo = ({ userInfo }) => {
    setAuthState({
      userInfo,
      isAuthenticated: userInfo && userInfo._id ? true : false,
    });
  };

  const logout = async () => {
    try {
      await fetchContext.authAxios.post("/logout");
      setAuthState({
        userInfo: {},
        isAuthenticated: false,
      });
      history.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Provider
      value={{
        authState,
        setAuthState: (authInfo) => setAuthInfo(authInfo),
        logout,
      }}
    >
      {children}
    </Provider>
  );
};

export { AuthContext, AuthProvider };
