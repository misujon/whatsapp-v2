import styled from "styled-components";
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { useCollection } from 'react-firebase-hooks/firestore';
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useState, useRef } from 'react';
import firebase from 'firebase';
import Message from './Message';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';
import pwafire from "pwafire";

import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'


function ChatScreen({ chat, messages }) {

    const pwa = pwafire.pwa;
    const [input, setInput] = useState("");
    const [user] = useAuthState(auth);
    const router = useRouter();
    const endOfMessageRef = useRef(null);

    const [messagesSnapshot] = useCollection(
        db
        .collection('chats')
        .doc(router.query.id)
        .collection('messages')
        .orderBy('timestamp', 'asc')
    );

    const scrollToBottom = () => {
        if (endOfMessageRef && endOfMessageRef.current) {
            endOfMessageRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    const showMessages = () => {
        if (messagesSnapshot) {
            if (messagesSnapshot?.docs?.length) {
                let GetMessagesLengths = messagesSnapshot.docs.length;
                let notifierData = messagesSnapshot.docs[(GetMessagesLengths - 1)].data();
                if (notifierData.user !== user.email) {
                    // console.log(notifierData);
                    const data = {
                        title: notifierData.name ? notifierData.name : notifierData.user,
                        options: {
                            body: notifierData.message,
                            icon: notifierData.photoUrl,
                            tag: "pwa",
                        },
                    };
                    
                    pwa.Notification(data);
                }
            }
                
            return [
                messagesSnapshot.docs.map((message) => (
                    <Message
                        key={message.id}
                        user={message.data().user}
                        message={{
                            ...message.data(),
                            timestamp: message.data().timestamp?.toDate().getTime(),
                        }}
                    />
                )),
                scrollToBottom()
            ]
        } else {
                        
            return [
                JSON.parse(messages).map((message) => (
                    <Message
                        key={message.id}
                        user={message.user}
                        message={message}
                    />
                )),
                scrollToBottom()
            ]
        }
    }


    const sendMessage = (e) => {
        e.preventDefault();

        db.collection('users').doc(user.uid).set(
            {
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoUrl: user.photoURL,
            name: user.displayName,
        });

        setInput('');
        scrollToBottom();
    }

    const [recipientSnapshot] = useCollection(
        db.collection('users').where('email', '==', getRecipientEmail(chat.users, user))
    );

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user);

    const [emojiInput, setemojiInput] = useState(false);

    const CheckEmojiInput = () => {
        if (!emojiInput) {
            return setemojiInput(true);
        } else {
            return setemojiInput(false);
        }
    }

    const addEmojiToInput = (e) => {
        return setInput(input + e.native);
    }
    

    return (
        <Container>

            <Header>
                {
                    recipient ? (
                        <Avatar src={recipient?.photoUrl} />
                    ) : (
                        <Avatar>{recipientEmail[0]}</Avatar>
                    )
                }

                <HeaderInformations>
                    {
                        recipient ? (
                            <h3>{recipient?.name}</h3>
                        ) : (
                            <h3>
                                {recipientEmail}
                            </h3>
                        )
                    }
                    {recipientSnapshot ? (
                        <p>Last Seen:{' '}
                            { recipient?.lastSeen?.toDate() ? (
                                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                            ) : "Offline"}
                        </p>
                    ) : (
                        <p>Loading Last Active...</p>
                    )}
                </HeaderInformations>

                <HeaderIcon>
                    <CustomIconButton>
                        <AttachFileIcon />
                    </CustomIconButton>

                    <CustomIconButton>
                        <MoreVertIcon />
                    </CustomIconButton>
                </HeaderIcon>
            </Header>


            <MessageContainer>
                { showMessages() }
                <EndOfMessage ref={endOfMessageRef} />
            </MessageContainer>

            
            <InputContainer>
                {emojiInput?<Picker onSelect={addEmojiToInput} />:''}
                <CustomInsertEmoticonIcon onClick={CheckEmojiInput} />
                <Input value={input} onChange={e => setInput(e.target.value)} />
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send</button>
                <CustomMicIcon />
            </InputContainer>
            
        </Container>
    )
}

export default ChatScreen;

const Container = styled.div`
    background-image: url('/background.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    height: 100vh;
`;

const Header = styled.div`
    position: sticky;
    background-color: #17393a;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
`;

const HeaderInformations = styled.div`
    margin-left: 15px;
    flex: 1;
    align-items: center;

    >h3 {
        margin-bottom: 3px;
        margin-top: 0;
        color: whitesmoke;
    }

    >p {
        font-size: 14px;
        color: gray;
        margin: 0;
    }
`;

const HeaderIcon = styled.div``;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;

const MessageContainer = styled.div`
    padding: 30px;
    overflow-y: scroll;
    height: 90vh;

    ::-webkit-scrollbar {
        display: none;
    }

    --ms-overflow-style: none;
    scrollbar-width: none;
`;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 100px;
    background-color: #3f4446;
    color: whitesmoke;
    padding: 15px 20px;
    margin-left: 15px;
    margin-right: 15px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: #17393a;
    z-index: 100;
`;

const CustomIconButton = styled(IconButton)`
    &&& {
        color: whitesmoke;
    }
`;

const CustomInsertEmoticonIcon = styled(InsertEmoticonIcon)`
    cursor: pointer;
    &&& {
        color: whitesmoke;
    }
`;

const CustomMicIcon = styled(MicIcon)`
    &&& {
        color: whitesmoke;
    }
`;