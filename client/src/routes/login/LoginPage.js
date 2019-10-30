import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import Link from '../../components/Link';
import UserForm from '../../components/UserForm';
import history from '../../history';
import { login } from '../../actions/user';

import s from './login.css';

class LoginPage extends React.Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    setUser: PropTypes.func.isRequired,
  };

  handleSubmit = async data => {
    const { setUser } = this.props;
    await setUser(data);
    history.push('/');
  };

  render() {
    const { message } = this.props;
    return (
      <div className={s.form}>
        {message && <Alert variant="info">{message}</Alert>}
        <h3 className={s.heading}>Log in to see your devices</h3>
        {process.env.BROWSER && (
          <div>
            <UserForm onSubmit={this.handleSubmit} submitText="Log in" />
            <div className={s.links}>
              <span className={s.notSignedUp}>Not signed up yet?</span>
              <Button variant="link">
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(bootstrap, s)(
  connect(
    ({ user: { message } }) => ({ message }),
    { setUser: login },
  )(LoginPage),
);
