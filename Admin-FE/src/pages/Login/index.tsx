import React from 'react'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';

const Login = () => {
    return (
        <div>
            <FormControl>
                <div>
                <InputLabel htmlFor="my-email">Email address</InputLabel>
                <Input id="my-email"/>
                </div>
                <div>
                <InputLabel htmlFor="my-password">Password</InputLabel>
                <Input id="my-password"/>
                </div>
            </FormControl>
        </div>
    )
}

export default Login
