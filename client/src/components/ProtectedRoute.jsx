import { Navigate } from 'react-router-dom';

// This component wraps around any route that needs protection
export default function ProtectedRoute({ children, allowedRoles }) {
    // 1. Get your user state from wherever you store it (Context, Redux, or localStorage)
    // NOTE: Update this line based on how you handle state!
    const user = JSON.parse(localStorage.getItem('user')); 

    // 2. If there is no user logged in, kick them to the login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. If roles are specified, check if the user has the right role
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If they are logged in but aren't a Recruiter, kick them to the home page
        return <Navigate to="/" replace />;
    }

    // 4. If they pass both checks, render the page!
    return children;
}