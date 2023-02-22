import {
    Navigate
} from "react-router-dom";

export type ProtectedRouteProps = {
    authenticationPath: string;
    outlet: JSX.Element;
};

export default function ProtectedRoute({ authenticationPath, outlet }: ProtectedRouteProps) {
    // console.log(outlet);
    // if (localStorage.getItem("user") && outlet.type.name != "Register") {
    //     return outlet;
    // } else if (!localStorage.getItem("user") && outlet.type.name == "Register") {
    //     return outlet;
    // }
    // else {
    //     return <Navigate to={{ pathname: authenticationPath }} />;
    // }

    return outlet;
};