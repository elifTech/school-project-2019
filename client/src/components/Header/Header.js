import PropTypes from 'prop-types';
import React, { memo, PureComponent } from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/withStyles';
import setUser from '../../actions/user';
import s from './Header.css';
import Link from '../Link';
import Navigation from '../Navigation';
import eliftechBanner from './eliftech-banner.png';
import { getRecentTracks } from '../../actions/music';

class Header extends PureComponent {
  static propTypes = {
    apiKey: PropTypes.string,
    dispatchGetRecentTracks: PropTypes.func,
    setUserData: PropTypes.func,
    username: PropTypes.string,
  };

  static defaultProps = {
    apiKey: '',
    dispatchGetRecentTracks: undefined,
    setUserData: undefined,
    username: '',
  };

  static whyDidYouRender = true;

  handleApiKeyChange = ({ target: { value } }) => {
    const { setUserData } = this.props;
    if (!setUserData) {
      return;
    }
    setUserData({
      apiKey: value,
    });
  };

  handleUsernameChange = ({ target: { value } }) => {
    console.info(value);
    const { setUserData } = this.props;
    if (!setUserData) {
      return;
    }
    setUserData({
      username: value,
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { dispatchGetRecentTracks } = this.props;
    if (dispatchGetRecentTracks) dispatchGetRecentTracks();
    return false;
  };

  render() {
    const { apiKey, username } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Navigation />
          <Link className={s.brand} to="/">
            <img src={eliftechBanner} alt="ElifTech" />
          </Link>
          <div className={s.banner}>
            <h1 className={s.bannerTitle}>React</h1>
            <p className={s.bannerDesc}>Complex web apps made easy</p>
          </div>
          <form className={s.userForm} onSubmit={this.handleSubmit}>
            <label htmlFor="username-input">
              Username
              <input
                id="username-input"
                onChange={this.handleUsernameChange}
                type="text"
                value={username}
              />
            </label>
            <label htmlFor="api-key-input">
              API key
              <input
                id="api-key-input"
                onChange={this.handleApiKeyChange}
                type="text"
                value={apiKey}
              />
            </label>
            <button type="submit">Fetch data</button>
          </form>
        </div>
      </div>
    );
  }
}
export default memo(
  withStyles(s)(
    connect(
      // mapStateToProps
      function mapStateToProps(state) {
        return {
          apiKey: state.user.apiKey,
          username: state.user.username,
        };
      },
      // mapDispatchToProps
      { dispatchGetRecentTracks: getRecentTracks, setUserData: setUser },
      // dispatchGetRecentTracks <- dispatch(getRecentTracks)
    )(Header),
  ),
);
