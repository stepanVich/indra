/* eslint-disable prefer-const */
/* eslint-disable react/prop-types */
import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';

export default class Form extends React.Component {
  state = {
    firstName: "",
    firstNameError: "",
    lastName: "",
    lastNameError: "",
    username: "",
    usernameError: "",
    email: "",
    emailError: "",
    password: "",
    passwordError: ""
  };

  change = (e: any) => {
    // this.props.onChange({ [e.target.name]: e.target.value });
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  validate = () => {
    let isError = false;
    const errors = {
      firstNameError: "",
      lastNameError: "",
      usernameError: "",
      emailError: "",
      passwordError: ""
    };

    /*if (this.state.username.length < 5) {
      isError = true;
      errors.usernameError = "Username needs to be atleast 5 characters long";
    }

    if (this.state.email.indexOf("@") === -1) {
      isError = true;
      errors.emailError = "Requires valid email";
    }*/

    this.setState({
      ...this.state,
      ...errors
    });

    return isError;
  };

  onSubmit = (e: any) => {
    console.log("--------onsubmit")
    e.preventDefault();
    const err = this.validate();
    console.log("--------err: " + (err))
    if (!err) {
      const xxx: any = this.props;
      xxx.onSubmit(this.state);
      // clear form
      this.setState({
        firstName: "",
        firstNameError: "",
        lastName: "",
        lastNameError: "",
        username: "",
        usernameError: "",
        email: "",
        emailError: "",
        password: "",
        passwordError: ""
      });
    }
  };

  render() {
    return (
      <form>
        <TextField
          name="firstName"
          helperText="First name"
          // floatingLabelText="First name"
          value={this.state.firstName}
          onChange={e => this.change(e)}
          //errorText={this.state.firstNameError}
          //floatingLabelFixed
        />
        <br />
        <TextField
          name="lastName"
          helperText="Last Name"
          //floatingLabelText="Last Name"
          value={this.state.lastName}
          onChange={e => this.change(e)}
          //errorText={this.state.lastNameError}
          //floatingLabelFixed
        />
        <br />
        <TextField
          name="username"
          helperText="Username"
          //floatingLabelText="Username"
          value={this.state.username}
          onChange={e => this.change(e)}
          //errorText={this.state.usernameError}
          //floatingLabelFixed
        />
        <br />
        <TextField
          name="email"
          helperText="Email"
          //floatingLabelText="Email"
          value={this.state.email}
          onChange={e => this.change(e)}
          //errorText={this.state.emailError}
          //floatingLabelFixed
        />
        <br />
        <TextField
          name="password"
          helperText="Password"
          //floatingLabelText="Password"
          value={this.state.password}
          onChange={e => this.change(e)}
          //errorText={this.state.passwordError}
          type="password"
          //floatingLabelFixed
        />
        <br />
        <Button variant="contained" color="primary" onClick={e => this.onSubmit(e)}>Submit</Button>
        {/* <Button variant="contained" label="Submit" onClick={e => this.onSubmit(e)} primary /> */}
      </form>
    );
  }
}