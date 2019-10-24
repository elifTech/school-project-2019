import React from 'react';

export default class extends React.Component {
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
      window.location = '/login';
      return null;
    }
    return children;
  }
}
