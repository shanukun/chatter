import React, {useEffect, useState} from 'react';
import ChatList from '../chatlist/chatlist';
import ChatViewComponent from '../chatview/chatView';
import ChatTextBoxComponent from '../chattextbox/chattextbox';
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

    const selectChat = (chatIndex) => {
        setSelectedChat(chatIndex);
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
                <ChatTextBoxComponent submitMessageFn={submitMessage} /> :
                null
            }
            <Button className={classes.signOutBtn} onClick={signOut}>Sign Out</Button>
        </div>
	);
}

export default withStyles(styles)(DashboardComponent);