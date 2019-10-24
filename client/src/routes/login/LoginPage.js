import React from 'react';
import { connect } from 'react-redux';
import Link from '../../components/Link';
import UserForm from '../../components/UserForm';
import { login } from '../../actions/user';

class LoginPage extends React.Component {
  handleSubmit = data => {
    this.props.setUser(data);
  };

  render() {
    return (
      <div>
        <UserForm onSubmit={this.handleSubmit} />
        <Link to="/signup">Sign up</Link>
        <Link to="/">Home</Link>
      </div>
    );
  }
}

export default connect(
  null,
  { setUser: login },
)(LoginPage);
