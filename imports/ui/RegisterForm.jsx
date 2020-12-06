import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import MuiAlert from "@material-ui/lab/Alert";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const componentName = "RegisterForm";
export const RegisterForm = ({ setExistingUser, setForgotPassword }) => {

  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [toastShown, setOpen] = useState(false);
  const [
    userAlreadyExistsToastShown,
    setuserAlreadyExistsToastShown,
  ] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    Meteor.call("log", componentName, "handleClose");
  };

  const handleUserAlreadyExistsToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setuserAlreadyExistsToastShown(false);
    Meteor.call("log", componentName, "handleUserAlreadyExistsToastClose");
  };

  const submit = (e) => {
    e.preventDefault();
    if (password === password2) {
      Accounts.createUser(
        {
          username: username,
          password: password2,
        },
        (error) => setuserAlreadyExistsToastShown(true)
      );
      Meteor.loginWithPassword(username, password);
    } else {
      setOpen(true);
    }
    Meteor.call("log", componentName, "submit");
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password2"
            label="re-type your password"
            type="password"
            id="password2"
            onChange={(e) => setPassword2(e.target.value)}
            autoComplete="current-password"
          />
          {/* <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={submit}
          >
            Register
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                href="#"
                variant="body2"
                onClick={() => setForgotPassword(true)}
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                href="#"
                variant="body2"
                onClick={() => setExistingUser(true)}
              >
                {"Already have an account? Sign In"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Typography variant="body2" color="textSecondary" align="center">
          {"Copyright © "}
          <Link color="inherit" href="https://material-ui.com/">
            Augment
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Box>
      <Snackbar open={toastShown} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Passwords do not match!
        </Alert>
      </Snackbar>
      <Snackbar
        open={userAlreadyExistsToastShown}
        autoHideDuration={6000}
        onClose={handleUserAlreadyExistsToastClose}
      >
        <Alert onClose={handleUserAlreadyExistsToastClose} severity="error">
          This username already exists!
        </Alert>
      </Snackbar>
    </Container>
  );
};
