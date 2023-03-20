import {
    Navigate
} from "react-router-dom";

export type ProtectedRouteProps = {
    authenticationPath: string;
    outlet: JSX.Element;
    user: object;
};

export default function ProtectedRoute({ authenticationPath, outlet, user }: ProtectedRouteProps) {
    if (Object.keys(user).length > 0 && outlet.type.name != "Register") {
        return outlet;
    } else if (Object.keys(user).length == 0 && outlet.type.name == "Register") {
        return outlet;
    }
    else {
        return <Navigate to={{ pathname: authenticationPath }} />;
    }
};