import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
    id : string;
    photo? : string;
    tweet : string;
    userId : string;
    username : string;
    createdAt : number;
}

const Wrapper = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
`;

export default function Timeline(){
    const [tweets,setTweet] = useState<ITweet[]>([]);

    

    // 트윗은 하나지만 react.js 에서 개발모드일때 useEffect()을 두번 불러와서 2개처럼 뜨는것
    useEffect(()=>{

        let unsubscribe : Unsubscribe | null = null;

        const fetchTweets = async() => {
            // query() 라는 함수를 firebase에서 가져와 어떤식으로 가져올지 정합니다.
            const tweetsQuery = query(
                collection(db,"tweets"),
                orderBy("createdAt","desc"), // createdAt 기준으로 desc 방향으로 정렬
                limit(25) // 페이지네비게이션 적용
            );
            
            /* 
                const spanshot = await getDocs(tweetsQuery); // 데이터를 가져옵니다.
                // spanshot.docs.forEach(doc=>console.log(doc.data())); // 데이터를 가져오면 array 형식으로 반환하기 때문에 forEach가 사용 가능합니다.
                const tweets = spanshot.docs.map((doc)=>{
                    const {tweet,createdAt,userId,username,photo} = doc.data();
                    return {
                        tweet,
                        createdAt,
                        userId,
                        username,
                        photo,
                        id: doc.id
                    }
                });
            */
    
            // 쿼리에 뭐가 추가되거나 업데이트될때
            // onSnapshot은 unsubscribe를 반환하는데 이것은 사용자가 브라우저를 보고있지 않거나 브라우저를 나갔을경우 변환하는것을 더이상 사용하지 않겠다는것을 의미합니다.
            unsubscribe = await onSnapshot(tweetsQuery, (snapshot)=>{
                const tweets = snapshot.docs.map((doc)=>{
                    const {tweet,createdAt,userId,username,photo} = doc.data();
                    return {
                        tweet,
                        createdAt,
                        userId,
                        username,
                        photo,
                        id: doc.id
                    }
                });
                setTweet(tweets);
            });
    
        };

        fetchTweets();

        return ()=>{ 
            // cleanup 기능을 사용해서 unsubscribe가 존재할때 unsubscribe() 을 실행합니다. 그럼 컴포넌트를 사용하지 않을때 unsubscribe()가 실행됨
            unsubscribe && unsubscribe();
        }

    },[]);

    return (
        <Wrapper>
            {
                tweets.map(tweet=><Tweet key={tweet.id} {...tweet}/>)
            }
        </Wrapper>
    );
}