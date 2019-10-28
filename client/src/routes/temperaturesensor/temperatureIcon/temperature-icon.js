import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './temperature-icon.css';
import iconHot from './Icons/hot';
import iconCold from './Icons/cold';
import iconNorm from './Icons/normal';

// let marginLeft = '7em';
let styleIcon = {
  marginLeft: '7em',
};

function IconTemperature(props) {
  const { degree } = props;
  let currentIcon;

  const coldTemperature = 20;
  const hotTemperature = 26;

  if (degree <= coldTemperature) {
    currentIcon = iconCold;
    styleIcon = {
      marginLeft: '6em',
    };
  } else if (degree >= hotTemperature) {
    currentIcon = iconHot;
    styleIcon = {
      marginLeft: '6.5em',
    };
  } else {
    currentIcon = iconNorm;
    styleIcon = {
      marginLeft: '7em',
    };
  }

  return <div style={styleIcon}>{currentIcon}</div>;
}

IconTemperature.propTypes = {
  degree: PropTypes.number.isRequired,
};

export default withStyles(s)(IconTemperature);
