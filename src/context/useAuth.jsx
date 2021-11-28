import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useHistory } from "react-router-dom";
import * as sessionsApi from "../api/sessions";
import * as usersApi from "../api/users";


const AuthContext = createContext(
    {
        user: null,
        loading: false,
        error: null,
        login: (email, password) => { },
        logout: () => { },
    }
);

export function AuthProvider({
    children,
}) {
    const [user, setUser] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingInitial, setLoadingInitial] = useState(true);
    // We are using `react-router` for this example,
    // but feel free to omit this or use the
    // router of your choice.
    const history = useHistory();

    // If we change page, reset the error state.
    useEffect(() => {
        if (error) setError(null);
    }, [window.location.pathname]);

    // Check if there is a currently active session
    // when the provider is mounted for the first time.
    //
    // If there is an error, it means there is no session.
    //
    // Finally, just signal the component that the initial load
    // is over.
    useEffect(() => {
        usersApi.getCurrentUser()
            .then((user) => user === "false" ? setUser(null) : setUser(localStorage.getItem("details")))
            .catch((_error) => { })
            .finally(() => setLoadingInitial(false));
    }, []);

    // Flags the component loading state and posts the login
    // data to the server.
    //
    // An error means that the email/password combination is
    // not valid.
    //
    // Finally, just signal the component that loading the
    // loading state is over.
    function login(email, password) {
        setLoading(true);

        sessionsApi.login({ email, password })
            .then((res) => {
                localStorage.setItem("details", res.loginName)
                setUser(localStorage.getItem("details"));
                history.push("/waiter");

            })
            .catch((error) => setError(error.message))
            .finally(() => {
                setLoading(false);

            });
    }



    // Call the logout endpoint and then remove the user
    // from the state.
    function logout() {
        sessionsApi.logout().then(() => setUser(undefined));
    }

    // Make the provider update only when it should.
    // We only want to force re-renders if the user,
    // loading or error states change.
    //
    // Whenever the `value` passed into a provider changes,
    // the whole tree under the provider re-renders, and
    // that can be very costly! Even in this case, where
    // you only get re-renders when logging in and out
    // we want to keep things very performant.
    const memoedValue = useMemo(
        () => ({
            user,
            loading,
            error,
            login,
            logout,
        }),
        [user, loading, error]
    );

    // We only want to render the underlying app after we
    // assert for the presence of a current user.
    return (
        <AuthContext.Provider value={memoedValue}>
            {!loadingInitial && children}
        </AuthContext.Provider>
    );
}

// Let's only export the `useAuth` hook instead of the context.
// We only want to use the hook directly and never the context component.
export default function useAuth() {
    return useContext(AuthContext);
}