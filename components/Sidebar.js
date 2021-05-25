import { Avatar, Button, IconButton } from '@material-ui/core';
import styled from 'styled-components';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatIcon from '@material-ui/icons/Chat';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Chat from '../components/Chat';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';

function Sidebar() {

    const [user] = useAuthState(auth);

    const userChatRef = db
        .collection('chats')
        .where('users', 'array-contains', user.email);
    
    const [chatsSnapshot] = useCollection(userChatRef);

    const createChat = () => {
        const input = prompt('Please enter an email address for the user you want to chat');

        if (!input) return null;
        
        if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
            db.collection('chats').add({
                users: [user.email, input],
            });
        }
    }

    const chatAlreadyExists = (recipientEmail) =>
        !!chatsSnapshot?.docs.find(
            (chat) =>
                chat.data().users.find((user) => user === recipientEmail)?.length > 0
        );

    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} />
                
                <IconsContainer>
                    <Tooltip title="New Chat">
                        <CustomIconButton>
                            <ChatIcon />
                        </CustomIconButton>
                    </Tooltip>

                    <Tooltip title="Options">
                        <CustomIconButton>
                            <MoreVertIcon />
                        </CustomIconButton>
                    </Tooltip>

                    <Tooltip title="Logout">
                        <CustomIconButton onClick={() => auth.signOut()}>
                            <ExitToAppIcon />
                        </CustomIconButton>
                    </Tooltip>
                </IconsContainer>
            </Header>

            <Search>
                <CustomSearchIconButton />
                <SearchInput placeholder="Search in chats" />
            </Search>

            <SidebarButtonContainer>
                <SidebarButton onClick={createChat}>Start a New Chat</SidebarButton>
            </SidebarButtonContainer>


            {/* List of Chats */}

            {chatsSnapshot?.docs.map((chat) => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
            ))}

        </Container>
    )
}

export default Sidebar;

const Container = styled.div`
    flex: 0.45;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;
    
    ::-webkit-scrollbar{
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
    background-color: #131C21;
`;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-radius: 5px;
    margin-bottom: 10px;
    background: #17393a;
`;

const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
    background: #17393a;
    color: #fff;
`;

const SidebarButtonContainer = styled.div`
    text-align: center;
`;

const SidebarButton = styled(Button)`
    width: 80%;

    &&& {
        border: 1px solid #39b926;
        color: white;
    }
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: #131C21;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;

    :hover{
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div``;

const CustomIconButton = styled(IconButton)`
    &&& {
        color: whitesmoke;
    }
`;

const CustomSearchIconButton = styled(SearchIcon)`
    &&& {
        color: whitesmoke;
    }
`;