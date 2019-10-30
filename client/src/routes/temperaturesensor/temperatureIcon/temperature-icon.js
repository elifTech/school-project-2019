import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './temperature-icon.css';
import iconHot from './Icons/hot.svg';
import iconCold from './Icons/cold.svg';
import iconNorm from './Icons/normal.svg';
import question from './Icons/question.svg';

let styleIcon = {
  marginLeft: '7em',
  marginTop: '2em',
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
      marginTop: '2em',
    };
  } else if (degree >= hotTemperature) {
    currentIcon = iconHot;
    styleIcon = {
      marginLeft: '6.5em',
      marginTop: '2em',
    };
  } else if (degree === undefined) {
    currentIcon = question;
    styleIcon = {
      marginLeft: '3em',
      marginTop: '2em',
    };
  } else {
    currentIcon = iconNorm;
    styleIcon = {
      marginLeft: '7em',
      marginTop: '2em',
    };
  }

  return <img style={styleIcon} src={currentIcon} alt="temperature" />;
}

IconTemperature.propTypes = {
  degree: PropTypes.number.isRequired,
};

export default withStyles(s)(IconTemperature);
