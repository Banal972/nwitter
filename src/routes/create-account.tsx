import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { 
    Error, 
    Form, 
    Input, 
    Swicher, 
    Title, 
    Wrapper 
} from "../componenets/auth-components";
import GithubButton from "../componenets/github-btn";

/* const errors = {
    "auth/email-already-in-use" : "That email is never"
} */

export default function CreateAccount(){

    const navigate = useNavigate();

    const [isLoading,setIsLoading] = useState(false);
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const onChange = (e : React.ChangeEvent<HTMLInputElement>)=>{
        const {target : {name,value}} = e;
        if(name === "name"){
            setName(value);
        } else if(name === "email"){
            setEmail(value);
        } else if (name === "password"){
            setPassword(value);
        }
    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError(''); // 에러를 한번 삭제해줌

        // 로딩이 true 고 name, email, password가 빈칸이면 실행시켜주지 않습니다.
        if( isLoading || name === "" || email === "" || password === "") return;
        try {
            // firebase 로 어떤것을 시도할찌 보여줄겁니다.  
            setIsLoading(true);
            // createUserWithEmailAndPassword는 firebase의 이메일과 비밀번호 로그인을 이용하는 함수 입니다. 항상 async/await 등 promise가 들어가있어야 합니다
            const credentials = await createUserWithEmailAndPassword( // 파라미터는 인스턴스, 이메일, 패스워드가 들어갑니다.
                auth,
                email,
                password
            );
            
            console.log(credentials.user); // 성공하면 유저의 정보를 가져와줍니다.
            await updateProfile(credentials.user,{ // 프로필을 업데이트할때 쓰는 함수
                displayName : name,
            });
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
            <Title>Join X</Title>
            <Form onSubmit={onSubmit}>
                <Input 
                    onChange={onChange}
                    name="name" 
                    value={name} 
                    placeholder="Name" 
                    type="text" 
                    required
                />
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
                <Input type="submit" value={isLoading ? "Loding..." : "Create Account"}/>
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Swicher>
                Already have an account? <Link to={'/login'}>Create on &arr;</Link>
            </Swicher>
            <GithubButton/>
        </Wrapper>
    )
    
}