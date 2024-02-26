import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute(
{
    children
} : {
    children : React.ReactNode
}) {

    // currentUser 는 유저가 로그인 했는지 안했는지를 체크해줍니다.
    const user = auth.currentUser;
    if(user === null){
        return <Navigate to="/login"/>
    }

    return children;
}