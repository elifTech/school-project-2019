import React from 'react';
import PropTypes from 'prop-types';
import history from '../../history';

export default class extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = {
    token: undefined,
  };

  componentDidMount() {
    this.setState({ token: localStorage.getItem('token') });
  }

  render() {
    const { token } = this.state;
    const { children } = this.props;
    if (typeof token === 'undefined') return 'Loading';
    if (!token) {
      history.push('/login');
      return null;
    }
    return children;
  }
}
