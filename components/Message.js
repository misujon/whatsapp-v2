import styled from "styled-components";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import moment from 'moment';

function Message({ user, message }) {

    const [loggedInUser] = useAuthState(auth);

    const TypeOfMessage = user == loggedInUser.email ? Sender : Receiver;

    return (
        <Container>
            <TypeOfMessage>
                {message.message}
                <Timestamp>
                    {message.timestamp ? moment(message.timestamp).format('LT') : '...'}
                </Timestamp>
            </TypeOfMessage>
        </Container>
    );
}

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
    width: fit-content;
    padding: 10px;
    border-radius: 8px;
    margin: 10px;
    min-width: 60px;
    padding-bottom: 26px;
    position: relative;
    text-align: right;
    color: whitesmoke;
    box-shadow: 0px 0px 10px -3px #000;
    max-width: 90%;
`;

const Sender = styled(MessageElement)`
    margin-left: auto;
    background-color: #056162;
    text-align: left;
`;

const Receiver = styled(MessageElement)`
    background-color: #262D31;
    text-align: left;
`;

const Timestamp = styled.span`
    color: gray;
    padding: 10px;
    font-size: 9px;
    position: absolute;
    bottom: 0;
    text-align: right;
    right: 0;
`;

