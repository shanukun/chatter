import React, {useEffect, useState} from 'react';
import ChatList from '../chatlist/chatlist';
import ChatViewComponent from '../chatview/chatView';
import ChatTextBoxComponent from '../chattextbox/chattextbox';
import NewChatComponent from '../newChat/newChat';
import { Button , withStyles } from '@material-ui/core';
import styles from './styles';
const firebase = require('firebase');

function DashboardComponent(props) {
    const [selectedChat, setSelectedChat] = useState(null);
    const [newChatFormVisible, setNewChatFormVisible] = useState(false);
    const [email, setEmail] = useState(null);
    const [chats, setChats] = useState([]);

    const {classes} = props;

    useEffect( () => {
        firebase.auth().onAuthStateChanged(async _usr => {
            if (!_usr) {
                props.history.push('/login');
            } else {
                await firebase
                    .firestore()
                    .collection('chats')
                    .where('users', 'array-contains', _usr.email)
                    .onSnapshot(async res => {
                        const chats = res.docs.map(_doc => _doc.data());
                        setEmail(_usr.email);
                        setChats(chats);
                        console.log(chats);                       
                    });

            }
        })
    }, []);

    const selectChat = async (chatIndex) => {
        await setSelectedChat(chatIndex);
        setNewChatFormVisible(false);
        messageRead();
    }
    const submitMessage = (msg) => {
        const docKey = buildDocKey(chats[selectedChat].users.filter(_usr => _usr !== email)[0]);
        firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .update({
                messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: email,
                    message: msg,
                    timestamp: Date.now()
                }),
                receiverHasRead: false
            });
    }
    const buildDocKey = (friend) => {
       return [email, friend].sort().join(':'); 
    }
    const newChatBtnClicked = () => {
       setNewChatFormVisible(true);
       setSelectedChat(null); 
    }
    const signOut = () => {
        firebase.auth().signOut();
    }

    const messageRead = () => {
        const docKey = buildDocKey(chats[selectedChat].users.filter(_usr => _usr !== email)[0]);
        if (clickedChatWhereNotSender(selectedChat)) {
            firebase
                .firestore()
                .collection('chats')
                .doc(docKey)
                .update({ receiverHasRead: true })
        } else {

        }
    }

    const goToChat = async (docKey, msg) => {
        const usersInChat = docKey.split(':');
        const chat = chats.find(_chat => usersInChat.every(_usr => _chat.users.includes()));
        setNewChatFormVisible(false);
        await selectChat(chats.indexOf(chat));
        submitMessage(msg);

    }
    const newChatSubmit = async (chatObj) => {
        const docKey = buildDocKey(chatObj.sendTo);
        await firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .set({
                receiverHasRead: false,
                users: [email, chatObj.sendTo],
                messages: [{
                    message: chatObj.message,
                    sender: email
                }]
            });
            setNewChatFormVisible(true);
            selectChat(chats.length -1);
    }
    const clickedChatWhereNotSender = (chatIndex) => {
        return chats[chatIndex].messages[chats[chatIndex].messages.length - 1].sender !== email;
    }

    return (
		<div>
            <ChatList history={props.history} 
            newChatBtnFn={newChatBtnClicked}
            selectChatFn={selectChat}
            userEmail={email}
            selectedChatIndex={selectedChat}
            chats={chats} />
            {
                newChatFormVisible ?
                null :
                <ChatViewComponent user={email}
                    chat={chats[selectedChat]} /> 
            }
            {
                selectedChat !== null && !newChatFormVisible ?
                <ChatTextBoxComponent messageReadFn={messageRead} submitMessageFn={submitMessage} /> :
                null
            }
            {
                newChatFormVisible ? 
                <NewChatComponent goToChatFn={goToChat} newChatSubmitFn={newChatSubmit} /> :
                null
            }
            <Button className={classes.signOutBtn} onClick={signOut}>Sign Out</Button>
        </div>
	);
}

export default withStyles(styles)(DashboardComponent);