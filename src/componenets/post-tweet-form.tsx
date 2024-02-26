import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components"
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;
const TextArea = styled.textarea`
    border: 2px solid white;
    padding: 20px;
    border-radius: 20px;
    font-size: 16px;
    color: white;
    background-color: black;
    width: 100%;
    resize: none;
    &::placeholder { 
        font-size: 16px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    &:focus {
        outline: none;
        border-color: #1d9bf0;
    }
`;
const AttachFileButton = styled.label`
    padding: 10px 0px ;
    color: #1d9bf0;
    text-align: center;
    border-radius: 20px;
    border: 1px solid #1d9bf0;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
`;

const AttachFileInput = styled.input`
    display : none;
`;

const SubmitBtn = styled.input`
    background-color: #1d9bf0;
    color: white;
    border: none;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    &:hover,
    &:active {
        opacity: 0.8;
    }
`;

export default function PostTweetForm(){

    const [isLoading,setLoading] = useState(false);
    const [tweet,setTweet] = useState('');
    const [file,setFile] = useState<File | null>(null);

    const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        setTweet(e.target.value);
    }

    const onFileChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const {files} = e.target;
        // file input을 복수로도 담을수 있게 배열을 반환해주기 때문에 이렇게 해야하는것
        if(files && files.length === 1){
            setFile(files[0]);
        }
    };

    const onSubmit =  async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const user = auth.currentUser; // 유저 정보 가져옴
        if(!user || isLoading || tweet === "" || tweet.length > 180) return;

        try {
            setLoading(true);

            // addDoc() 함수는 새로운 도큐먼트를 생성해줍니다.
            // 어떤 컬랙션에 만든지를 정해야해서 collection() 라는 함수를 이용하는데 파라밑어 안에 firestore 인스턴스를 넣어줘야합니다. 저희는 firebase.ts안에 db라는 이름으로 저장해주었습니다.
            const doc = await addDoc(collection(db,"tweets"),{
                tweet, // 트윗
                createdAt : Date.now(), // 작성일
                username : user.displayName || "Anonymous", // 유저의 이름
                userId : user.uid // 유저의 아이디
            });

            if(file){
                // ref() 라는 firebase 의 함수를 사용해서 스토리지와 연결을 해줄겁니다.
                const locationRef = ref(
                    storage,
                    `tweets/${user.uid}/${doc.id}`
                ); // tweets/${user.uid} - ${user.displayName} 라는 폴더를 생성하고 저장한 도큐먼드의 id를 가져와서 저장해줍니다.
                const result = await uploadBytes(locationRef,file); // 경로에 file을 저장합니다.

                const url = await getDownloadURL(result.ref); // 올라간 파일의 퍼블릭 URL로 반환해줍니다.

                // updateDoc() 를 통해서 document를 넣어 그 안에있는 filde 를 수정합니다.
                await updateDoc(doc,{
                    photo : url
                });

            }

            setTweet("");
            setFile(null);

        } catch(e) {
            console.log(e);
        } finally {
            setLoading(false);
        }

    }

    return (
        <Form onSubmit={onSubmit}>
            <TextArea 
                required
                rows={5}
                maxLength={180}
                onChange={onChange} 
                value={tweet}
                placeholder="What is happening?"
            />
            <AttachFileButton 
                htmlFor="file"
            >{file ? "Photo added " : "Add Photo"}</AttachFileButton>
            <AttachFileInput 
                onChange={onFileChange} 
                type="file" 
                id="file" 
                accept="image/*"
            />
            <SubmitBtn 
                type="submit" 
                value={isLoading ? "Posting..." : "Post Tweet"}
            />
        </Form>
    )
    
}