import React, { useEffect, useState } from 'react';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';


function ChatViewComponent (props) {
	const { classes, chat, user } = props;

	useEffect(() => {
		const container = document.getElementById('chatview-container');
		if (container) {
			container.scrollTo(0, container.scrollHeight);
		}
	});

	if (chat === undefined) {
		return (
			<main id='chatview-container' className={classes.content}>

			</main>
		);
	} else {
		return (
			<div> 
				<div className={classes.chatHeader}>
					Your conversation with {chat.users.filter(_usr => _usr !== user)[0]}
				</div>
				<main id='chatview-container' className={classes.content}>
					{
						chat.messages.map((_msg, _index) => {
							return (
								<div key={_index} className={_msg.sender === user ? classes.userSent : classes.friendSent}>
								{_msg.message}
								</div>
							);
						})
					}		
				</main>
			</div>
		);
	}


}

export default withStyles(styles)(ChatViewComponent);