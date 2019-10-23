import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Spinner } from 'react-bootstrap';
import s from './Loader.css';

const spinnerStyle = { backgroundColor: '#3f496f' };

const Loader = () => (
  <div className={s.overlay}>
    <div className={s.spinner}>
      <Spinner animation="grow" variant="primary" style={spinnerStyle} />
    </div>
  </div>
);

export default withStyles(s)(Loader);
