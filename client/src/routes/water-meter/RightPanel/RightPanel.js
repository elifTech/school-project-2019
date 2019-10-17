import React from 'react';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './RightPanel.css';

const RightPanel = () => {
  return <div className={s.info}>Some useful info</div>;
};

export default withStyles(s)(RightPanel);
