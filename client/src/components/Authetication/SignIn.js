import React, { useState } from 'react'
import axios from "axios";
import { useHistory  } from 'react-router-dom'
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOpenOutlined'
import useStyles from './styles';
import Input from './Input';
//import { signin, signup, forgotPassword} from '../../actions/auth';

const initialState = {firstName:'',lastName:'',email:'',password:'',confirmPassword:''};

const Auth = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup,setIsSignup] = useState(2);
    const [error, setError] = useState(0);
    const [check, setCheck] = useState(0);
    const [formData, setFormData] = useState(initialState);
    const classes = useStyles();
    //const dispatch = useDispatch();
    const history = useHistory();
    const handleSubmit = async (e) => {
        e.preventDefault(); //to get console.log() in react.
       if(isSignup == 0){
          if(formData.password != formData.confirmPassword){
            setCheck(check+1);
          }
          //else dispatch(signup(formData, navigate ));
          const res = await axios.post("http://localhost:8000/users/signup", formData)
          if(res.data.token){
            setIsSignup(2);
          }
       } else if(isSignup == 1) {
          //dispatch(forgotPassword(formData, navigate));
       } else {
        setError(error+1);
        console.log(formData);
         // dispatch(signin(formData, navigate ));
        const res = await axios.post("http://localhost:8000/users/signin", formData)
        console.log(res.data);
        if(res.data.token){
          localStorage.setItem('profile', JSON.stringify({ ...res?.data }));
          history.push(`/user/${res.data.result.id}`)
        }
       }
       console.log(error);
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const switchMode = () => {
        if(isSignup == 2){
           setIsSignup(0);
        } else setIsSignup(2);
        setError(0);
        setCheck(0);
    }

    const forgotMode = () => {
        if(isSignup == 2 || isSignup == 0){
           setIsSignup(1);}
        else setIsSignup(2);
        setError(0);
        setCheck(0);
    }
  return (
    <div style={{height: '100vh'}}>
<Container component="main" maxWidth="xs">
  <Paper className={classes.paper} elevation={3}>
    <Avatar className={classes.avatar}>
      <LockOutlinedIcon />
    </Avatar>
    <Typography variant="h5">
      {isSignup === 0 ? 'Sign up' : 'Sign In'}
    </Typography>
    <form className={classes.form} onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {isSignup === 0 && (
          <>
            <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus  />
            <Input name="lastName" label="Last Name" handleChange={handleChange}  />
          </>
        )}
        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
        {isSignup !== 1 && (
          <Input
            name="password"
            label="Password"
            handleChange={handleChange}
            type={showPassword ? 'text' : 'password'}
            handleShowPassword={handleShowPassword}
          />
        )}
        {isSignup === 0 && (
          <Input
            name="confirmPassword"
            label="Repeat Password"
            type={showPassword ? 'text' : 'password'}
            handleChange={handleChange}
          />
        )}
        {error > 0 && <Typography variant="p2">Invalid username or password</Typography>}
        {check > 0 && <Typography variant="p2">Password Mismatch</Typography>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          {isSignup === 0 ? 'Sign Up' : 'Sign In'}
        </Button>
        <Grid container justify="flex-end">
          <Grid item>
            <Button onClick={switchMode}>
              {isSignup === 0
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </Button>
            <Button onClick={forgotMode}>Forgot Password</Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  </Paper>
</Container>
</div>
  )
}

export default Auth