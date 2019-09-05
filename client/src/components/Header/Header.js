import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './Header.css';
import Link from '../Link';
import Navigation from '../Navigation';
import eliftechBanner from './eliftech-banner.png';

function Header() {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <Navigation />
        <Link className={s.brand} to="/">
          <img src={eliftechBanner} alt="ElifTech" />
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
Header.whyDidYouRender = true;
export default withStyles(s)(React.memo(Header));
