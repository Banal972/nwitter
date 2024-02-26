import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Error, Form, Input, Swicher, Title, Wrapper } from "../componenets/auth-components";
import GithubButton from "../componenets/github-btn";


/* const errors = {
    "auth/email-already-in-use" : "That email is never"
} */

export default function CreateAccount(){

    const navigate = useNavigate();

    const [isLoading,setIsLoading] = useState(false);
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const onChange = (e : React.ChangeEvent<HTMLInputElement>)=>{
        const {target : {name,value}} = e;
        if(name === "email"){
            setEmail(value);
        } else if (name === "password"){
            setPassword(value);
        }
    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError(''); // 에러를 한번 삭제해줌
        
        // 로딩이 true 고 email, password가 빈칸이면 실행시켜주지 않습니다.
        if( isLoading || email === "" || password === "") return;
        try {
            // firebase 로 어떤것을 시도할찌 보여줄겁니다.  
            setIsLoading(true);
            //signInWithEmailAndPassword 함수가 auth가 있고 cordoava가 있는데 꼭 auth로 가져와야합니다
            await signInWithEmailAndPassword(auth,email,password); // 회원가입가 마찬가지로 auth 의 인스턴스와 emial , password 가 필요합니다.
            navigate('/');

        } catch(e){
            // firebase에서 오류가 발생하면 알려주고
            if(e instanceof FirebaseError){
                setError(e.message);
            }
        }
        finally { 
            // 어떤것이든 모두 실행시켜줘야할때
            setIsLoading(false);
        }
        // create an account
        // set the name of the user
        // redirect to the home page
        // console.log(name,email,password);
    }
    return (
        <Wrapper>
            <Title>Login X</Title>
            <Form onSubmit={onSubmit}>
                <Input
                    onChange={onChange}
                    name="email" 
                    value={email} 
                    placeholder="Email" 
                    type="email" 
                    required
                />
                <Input 
                    onChange={onChange}
                    name="password" 
                    value={password} 
                    placeholder="Password" 
                    type="password" 
                    required
                />
                <Input type="submit" value={isLoading ? "Loding..." : "Log in"}/>
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Swicher>
                Dont't have an account? <Link to={'/create-account'}>Create on &arr;</Link>
            </Swicher>
            <GithubButton/>
        </Wrapper>
    )
    
}