import { useRouter } from "next/router";
import { app } from "./firebaseConfig"; // Import your Firebase app
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

function withAuthentication(Component) {
  const AuthenticatedPage = (props) => {
    const auth = getAuth(app); // Use the imported app instance
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
      console.log("Loading:", loading);
      console.log("User:", user);
      if (!loading && !user) {
        // Redirect to /login with the current pathname as a query parameter
        router.push("/login?r=" + router.pathname);
      }
    }, [loading, user, router]);

    if (loading) {
      return <>Loading...</>; // Optionally, show a loading state
    }

    // If user is authenticated, render the component
    return <Component {...props} />;
  };

  return AuthenticatedPage;
}

export default withAuthentication;
