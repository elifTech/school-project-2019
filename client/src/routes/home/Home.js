import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './Home.css';

function Home() {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>Hello, Eliftech School</h1>
      </div>
    </div>
  );
}
Home.whyDidYouRender = true;
export default withStyles(s)(React.memo(Home));
