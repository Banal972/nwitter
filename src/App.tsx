import {RouterProvider, createBrowserRouter} from "react-router-dom";
import Layout from "./componenets/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import LoadingScreen from "./componenets/loading-screen";
import { auth } from "./firebase";
import ProtectedRoute from "./componenets/protected-route";

const router = createBrowserRouter([
  {
    path : "/",
    element : (
      <ProtectedRoute>
        <Layout/>
      </ProtectedRoute>
    ),
    children : [
      {
        path : "",
        element : <Home/>
      },
      {
        path : "profile",
        element : <Profile/>
      }
    ]
  },
  {
    path : "/login",
    element : <Login/>
  },
  {
    path : "/create-account",
    element : <CreateAccount/>
  }
])

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body{
    background-color: black;
    color: white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

function App() {

  const [isLoding,setIsLoding] = useState(true);
  const init = async()=>{
    // firebase 을 기다려줍니다.
    await auth.authStateReady(); // authStateReady는 기다려주는것 쿠키와 토큰을 읽고 밴엔드와 소통해서 로그인여부를 기다려주는것
    setIsLoding(false); // firebase가 준비가 다 되면 false로
  }
  useEffect(()=>{
    init();
  },[]);

  return (
    <Wrapper>
      <GlobalStyles/>
      {isLoding ? <LoadingScreen/> : <RouterProvider router={router}/>}
    </Wrapper>
  )
}

export default App
