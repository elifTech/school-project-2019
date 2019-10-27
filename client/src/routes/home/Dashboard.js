import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import Alert from 'react-bootstrap/Alert';
import s from './Dashboard.css';

function Dashboard({ message }) {
  return (
    <div className={s.root}>
      {message && <Alert variant="info">{message}</Alert>}
      <div className={s.container}>Dashboard</div>
    </div>
  );
}
Dashboard.whyDidYouRender = true;
Dashboard.propTypes = {
  message: PropTypes.string.isRequired,
};

export default withStyles(s)(
  connect(({ user: { message } }) => ({ message }))(React.memo(Dashboard)),
);
