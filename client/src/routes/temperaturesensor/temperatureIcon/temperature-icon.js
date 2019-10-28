import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './temperature-icon.css';
import iconHot from './Icons/hot';
import iconCold from './Icons/cold';
import iconNorm from './Icons/normal';

function IconTemperature(props) {
  const { degree } = props;
  let currentIcon;

  const coldTemperature = 20;
  const hotTemperature = 26;

  if (degree <= coldTemperature) {
    currentIcon = iconCold;
  } else if (degree >= hotTemperature) {
    currentIcon = iconHot;
  } else {
    currentIcon = iconNorm;
  }

  return <div className={s.aligning}>{currentIcon}</div>;
}

IconTemperature.propTypes = {
  degree: PropTypes.number.isRequired,
};

export default withStyles(s)(IconTemperature);
