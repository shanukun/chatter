import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styles from './style';
const firebase = require('firebase');

function SignupComponent(props) {
    const { classes } = props;
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [passwordConfirm, setPasswordConfirm] = useState(null);
    const [signupError, setSignupError] = useState('');

    const submitSignup = (e) => {
        e.preventDefault();
        if (!formIsValid()) {
            setSignupError("Password do not match.");
            return;
        }

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(authRes => {
                const userObj = {
                    email: authRes.user.email
            };
            firebase
            .firestore()
            .collection('user')    
            .doc(email)
            .set(userObj)
            .then(() => {
                props.history.push('/dashboard');
            }, dbErr => {
                console.log(dbErr);
                setSignupError('Failed to add user.');
            });
        }, authErr => {
            console.log(authErr);
            setSignupError('Failed to add user.');
        });
    }

    const formIsValid = () => {
        if (password === passwordConfirm) {
            return true;
        }
        return false;
    }

    const userTyping = (type, e) => {
        switch (type) {
            case 'email':
                setEmail(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            case 'passwordConfirm':
                setPasswordConfirm(e.target.value);
                break;
            default: break;
        }
    }

    return (
        <main className={classes.main}>
            <CssBaseline></CssBaseline>
            <Paper className={classes.paper}>
                <Typography component='h1' variant='h5'>
                    Sign Up!
                </Typography>
                <form onSubmit={(e) => submitSignup(e)} className={classes.form}>
                    <FormControl required fullWidth margin='normal'>
                        <InputLabel htmlFor='signup-email-input'>Enter Your email</InputLabel>
                        <Input autoComplete='email' onChange={(e) => userTyping('email', e)} autoFocus id='signup-email-input'></Input>
                    </FormControl>
                    <FormControl required fullWidth margin='normal'>
                        <InputLabel htmlFor='signup-password-input'>Create Password</InputLabel>
                        <Input type='password' onChange={(e) => userTyping('password', e)} id='signup-password-input'></Input>
                    </FormControl>
                    <FormControl required fullWidth margin='normal'>
                        <InputLabel htmlFor='signup-password-confirm-input'>Confirm Password</InputLabel>
                        <Input type='password' onChange={(e) => userTyping('passwordConfirm', e)} id='signup-password-confirm-input'></Input>
                    </FormControl>
                    <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>Submit</Button>
                </form>
                {
                    signupError ?
                    <Typography className={classes.errorText} component='h5' variant='h6'>
                        {signupError}
                    </Typography> :
                    null
                }
                <Typography component='h5' variant='h6' className={classes.hasAccountHeader}>
                    Already Have An Account?
                </Typography>
                <Link className={classes.logInLink} to>Log In!</Link>


            </Paper>
        </main>    
	);
}

export default withStyles(styles)(SignupComponent);