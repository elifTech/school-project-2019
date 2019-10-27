import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import Button from 'react-bootstrap/Button';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import Link from '../../components/Link';
import UserForm from '../../components/UserForm';
import history from '../../history';
import { signup } from '../../actions/user';

import s from './signup.css';

class SignupPage extends React.Component {
  static propTypes = {
    signupUser: PropTypes.func.isRequired,
  };

  handleSubmit = async data => {
    const { signupUser } = this.props;
    await signupUser(data);
    history.push('/login');
  };

  render() {
    return (
      <div className={s.form}>
        <h3 className={s.heading}>Registration</h3>
        {process.env.BROWSER && (
          <UserForm onSubmit={this.handleSubmit} submitText="Sign up" />
        )}
        {process.env.BROWSER && (
          <div className={s.links}>
            <span className={s.wantLogin}>Already signed up?</span>
            <Button variant="link">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(bootstrap, s)(
  connect(
    null,
    { signupUser: signup },
  )(SignupPage),
);
