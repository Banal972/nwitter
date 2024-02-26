import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components"
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Button = styled.span`
    background-color: white;
    margin-top: 50px;
    width: 100%;
    color: black;
    font-weight: 600;
    padding: 10px 20px;
    border-radius: 50px;
    border: 0;
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;
const Logo = styled.img`
    height : 25px;
`;

export default function GithubButton(){

    const navigate = useNavigate();

    const onClick = async ()=>{
        try {
            const provider = new GithubAuthProvider(); // 깃헙의 provider 를 가져옵니다.
            //signInWithPopup 는 팝업창으로 해당 provider 와 연결해줍니다.
            await signInWithPopup(auth,provider); // auth, provider 를 가져와야함
            //signInWithRedirect 는 해당 로그인사이트로 리다이렉트해서 로그인을 합니다.
            // await signInWithRedirect(auth,provider); // auth, provider 를 가져와야함
            navigate('/');
        } catch (e){
            console.error(e);
        }
    }

    return (
        <Button onClick={onClick}>
            <Logo src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"/> 
            Continue with Github
        </Button>
    )
}