import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './temperature-icon.css';
import iconHot from './Icons/hot.svg';
import iconCold from './Icons/cold.svg';
import iconNorm from './Icons/normal.svg';

let styleIcon = {
  marginLeft: '7em',
  marginTop: '3em',
};

const styleForUndefined = {
  marginTop: '9.5em',
};

function IconTemperature(props) {
  const { degree } = props;
  if (degree !== undefined) {
    let currentIcon;

    const coldTemperature = 20;
    const hotTemperature = 26;

    if (degree <= coldTemperature) {
      currentIcon = iconCold;
      styleIcon = {
        marginLeft: '6em',
        marginTop: '3em',
      };
    } else if (degree >= hotTemperature) {
      currentIcon = iconHot;
      styleIcon = {
        marginLeft: '6.5em',
        marginTop: '3em',
      };
    } else {
      currentIcon = iconNorm;
      styleIcon = {
        marginLeft: '7em',
        marginTop: '3em',
      };
    }

    return <img style={styleIcon} src={currentIcon} alt="temperature" />;
  }

  return (
    <h1 style={styleForUndefined}>
      Please, turn on your sensor to see relevant logs
    </h1>
  );
}

IconTemperature.propTypes = {
  degree: PropTypes.number.isRequired,
};

export default withStyles(s)(IconTemperature);
