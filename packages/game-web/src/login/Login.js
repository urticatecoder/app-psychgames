
import React, {useState} from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoginButton from './LoginButton'

const NO_CODE = false;

const styles = {
    welcomeText: {
        marginTop: '25vh',
    },
    welcomeInstruction: {
        marginTop: '1vh',
    },
    loginInput: {
        fontSize: 40,
    },
    loginField: {
        width: '400px',
        marginTop: '3vh',
    },
    submitButton: {
        marginTop: '5vh',
        width: '200px',
        height: '50px',
    },
}

/**
 * Login page that is shown on the '/' route. Allows users to enter login codes; sends them to the server; and moves into the game if the code is valid.
 *
 * @author Eric Doppelt
 */
function Login(props) {

    const [invalidCode, setInvalidCode] = useState(NO_CODE);

    return(
        <div>

            <Typography sx={{...styles.welcomeText}} variant='h3'>
                Welcome to Rise to the Top!
            </Typography>

            <Typography sx={{...styles.welcomeInstruction}} variant='h4'>
                <Box fontStyle="italic" >
                    Please enter your Prolific ID.
                </Box>
            </Typography>

            <TextField
                sx={{...styles.loginField}}
                InputProps={{sx: styles.loginInput}}
                   
                value={props.loginCode}
                label='Login Code'
                variant='standard'
                error={invalidCode}
                onChange={(event) => props.setLoginCode(event.target.value)}
                >
            </TextField>

            <LoginButton 
                code={props.code} 
                invalidCode={invalidCode} 
                setInvalidCode={setInvalidCode} 
                setShowWarnings={props.setShowWarnings}
            />
        </div>
    );
}

export default Login;
