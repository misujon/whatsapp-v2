import { Avatar } from '@material-ui/core';
import styled from 'styled-components';
import getRecipientEmail from '../utils/getRecipientEmail';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';

function Chat({ id, users }) {

    const router = useRouter();
    const [user] = useAuthState(auth);
    const recipientEmail = getRecipientEmail(users, user);
    const [recipientSnapshot] = useCollection(
        db.collection('users').where('email', '==', getRecipientEmail(users, user))
    );
    const recipient = recipientSnapshot?.docs?.[0]?.data();

    const enterChat = () => {
        router.push(`/chat/${id}`);
    }

    const ShowActiveChatUser = id == router.query.id ? ActiveUser : Container;

    return (
        <ShowActiveChatUser onClick={enterChat}>
            {
                recipient ? (
                    <UserAvatar src={recipient?.photoUrl} />
                ) : (
                    <UserAvatar>{recipientEmail[0]}</UserAvatar>
                )
            }
            {
                recipient ? (
                    <p>
                        {recipient?.name}
                        <br />
                        <small>{recipientEmail}</small>
                    </p>
                ) : (
                    <p>
                        {recipientEmail}
                    </p>
                )
            }
        </ShowActiveChatUser>
    )
}

export default Chat;

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 5px;
    word-break: break-word;
    color: whitesmoke;
    text-align: left;

    :hover {
        background-color: #323739;
    }
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;

const ActiveUser = styled(Container)`
    background-color: #323739;
`;