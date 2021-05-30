import { Button } from '@material-ui/core';
import Head from 'next/head';
import styled from 'styled-components';
import { auth, provider } from '../firebase';

function Login() {

    const signIn = () => {
        auth.signInWithPopup(provider).catch(alert);
    }

    return (
        <Container>
            <Head>
                <title>Whats App 2.0 - Login</title>
            </Head>

            <LoginContainer>
                <Logo src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" />
                <CustomButton variant="outlined" onClick={signIn}>Sign in with Google</CustomButton>
            </LoginContainer>
        </Container>
    )
}

export default Login;

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-image: url('/background.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: fixed;
    width: 100%;
`;

const LoginContainer = styled.div`
    padding: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #17393a;
    border-radius: 5px;
    box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);

    @media (max-width: 767px) {
        padding: 50px;
    }
`;

const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;

    @media (max-width: 767px) {
        height: 150px;
        width: 150px;
    }
`;

const CustomButton = styled(Button)`
    &&& {
        border: 1px solid #39b926;
        color: white;
    }
`;
