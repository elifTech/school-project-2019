import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './Navigation.css';
import Link from '../Link';

function Navigation() {
  return (
    <div className={s.root} role="navigation">
      <Link className={s.link} to="/">
        Home
      </Link>
    </div>
  );
}
Navigation.whyDidYouRender = true;
export default withStyles(s)(React.memo(Navigation));
