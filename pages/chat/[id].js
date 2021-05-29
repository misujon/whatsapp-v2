import Head from 'next/head';
import styled from "styled-components";
import Sidebar from '../../components/Sidebar';
import ChatScreen from '../../components/ChatScreen';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import getRecipientEmail from '../../utils/getRecipientEmail';
import useWindowSize from '../../utils/common';
import { useState } from 'react';
import { useRouter } from 'next/router';

function Chat({ chat, messages }) {

    const [SideBarStatus, setSideBarStatus] = useState(false);
    const [user] = useAuthState(auth);
    const windowSize = useWindowSize();

    const getSideBarStatus = (status) => {
        setSideBarStatus(status);
    }

    const router = useRouter();
    const ResponsiveSidebar = () => {
        if (windowSize.width > 767) {

            return <CustomSidebarShowDesktop />;

        } else {

            if (SideBarStatus && router.query.id) {
                router.push(`/`);
            }
        }
    }

    return (
        <Container>
            <Head>
                <title>Chat with { getRecipientEmail(chat.users, user) }</title>
            </Head>

            { ResponsiveSidebar() }
            
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} statusSidebar={getSideBarStatus} />
            </ChatContainer>
        </Container>
    )
}

export default Chat;

export async function getServerSideProps(context) {
    const ref = db
        .collection('chats')
        .doc(context.query.id);
    
    const messagesRes = await ref
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .get();
    
    const messages = messagesRes.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime(),
    }))

    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }
}

const CustomSidebarShowDesktop = styled(Sidebar)`
    display: block;
`;

const CustomSidebarShowMobile = styled(Sidebar)`
    display: block;
`;

const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar {
        display: none;
    }

    --ms-overflow-style: none;
    scrollbar-width: none;
`;