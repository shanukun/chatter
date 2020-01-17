import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Send from '@material-ui/icons/Send';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';

function ChatTextBoxComponent(props) {
	const [chatText, setChatText] = useState('');

	const { classes } = props;

	const userTyping = (e) => {
		e.keyCode === 13 ? 
		submitMessage() : setChatText(e.target.value);
	}
	const messageValid = (txt) => {
		return txt && txt.replace(/\s/g, '').length;
	}

	const userClickedInput = (txt) => {
		props.messageReadFn();
	}
	
	const submitMessage = () => {
		if (messageValid(chatText)) {
			props.submitMessageFn(chatText);
			document.getElementById('chattextbox').value = '';

		}

	}

	return (
		<div className={classes.chatTextBoxContainer}>
			<TextField placeholder='Type your message ...' onKeyUp={(e) => {
					userTyping(e)
				}} 
				id='chattextbox'
				className={classes.chatTextBox}
				onFocus={userClickedInput}>

			</TextField>
			<Send onClick={submitMessage} className={classes.sendBtn}></Send>
		</div>
	);

}
export default withStyles(styles)(ChatTextBoxComponent);