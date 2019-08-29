import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './Home.css';

class Home extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Hello, Eliftech School</h1>
        </div>
      </div>
    );
  }
}
export default withStyles(s)(Home);
