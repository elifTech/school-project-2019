import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './Footer.css';
import Link from '../Link';

function Footer() {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <Link className={s.link} to="https://eliftech.com">
          © Your Company
        </Link>
        <span className={s.spacer}>·</span>
        <Link className={s.link} to="/">
          Home
        </Link>
        <span className={s.spacer}>·</span>
        <Link className={s.link} to="/admin">
          Admin
        </Link>
        <span className={s.spacer}>·</span>
        <Link className={s.link} to="/privacy">
          Privacy
        </Link>
        <span className={s.spacer}>·</span>
        <Link className={s.link} to="/not-found">
          Not Found
        </Link>
      </div>
    </div>
  );
}
Footer.whyDidYouRender = true;
export default withStyles(s)(React.memo(Footer));