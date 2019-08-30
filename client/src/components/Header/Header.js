import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './Header.css';
import Link from '../Link';
import Navigation from '../Navigation';
import eliftechBanner from './eliftech-banner.jpg';

class Header extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Navigation />
          <Link className={s.brand} to="/">
            <img src={eliftechBanner} width="38" height="38" alt="ElifTech" />
            {/* <span className={s.brandTxt}>ElifTech</span> */}
          </Link>
          <div className={s.banner}>
            <h1 className={s.bannerTitle}>React</h1>
            <p className={s.bannerDesc}>Complex web apps made easy</p>
          </div>
        </div>
      </div>
    );
  }
}
export default withStyles(s)(Header);