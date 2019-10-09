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
import ListenerForm from '../ListenerForm';

class Header extends PureComponent {
  static propTypes = {
    dispatchGetRecentTracks: PropTypes.func,
    setUserData: PropTypes.func,
  };

  static defaultProps = {
    dispatchGetRecentTracks: undefined,
    setUserData: undefined,
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

  handleSubmit = () => {
    const { dispatchGetRecentTracks } = this.props;
    if (dispatchGetRecentTracks) dispatchGetRecentTracks();
    return false;
  };

  render() {
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
          <ListenerForm onSubmit={this.handleSubmit} />
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
