import React from 'react';
import { connect } from 'react-redux';
import UserForm from '../../components/UserForm';
import { signup } from '../../actions/user';

class SignupPage extends React.Component {
  handleSubmit = data => {
    this.props.signupUser(data);
  };

  render() {
    return <UserForm onSubmit={this.handleSubmit} />;
  }
}

export default connect(
  null,
  { signupUser: signup },
)(SignupPage);
