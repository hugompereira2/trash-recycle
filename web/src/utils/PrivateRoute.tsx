import { Navigate, useLocation } from "react-router-dom";

export type ProtectedRouteProps = {
    authenticationPath: string;
    outlet: JSX.Element;
};

function checkUser(user: any, outletLocation: string): boolean {
    switch (outletLocation) {
        case "/register":
            return true;
        case "/dashboard":
            return user.userType_id === "7635808d-3f19-4543-ad4b-9390bd4b3770";
        case "/solicitacao":
            return user.userType_id === "975791b6-e2c6-465f-848b-852811563230";
        default:
            return false;
    }
}

export default function ProtectedRoute({ authenticationPath, outlet }: ProtectedRouteProps) {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : {};
    const location = useLocation();

    if (Object.keys(user).length > 0 && !checkUser(user, location.pathname)) {
        return outlet;
    } else if (Object.keys(user).length == 0 && checkUser(user, location.pathname)) {
        return outlet;
    } else {
        return <Navigate to={{ pathname: authenticationPath }} />;
    }
};
