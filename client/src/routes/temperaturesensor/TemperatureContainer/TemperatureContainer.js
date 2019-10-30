import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './TemperatureContainer.css';

const innerContainer = {
  background: 'rgba(239,240,243,.38)',
  borderRadius: '0.5em',
  boxShadow: '0 0 8px 1px rgb(198, 199, 203)',
  height: '5em',
  marginTop: '2em',
  padding: '1em',
};

const sensor = {
  font: 'bold 20px serif',
  height: '5em',
  paddingLeft: '5.5em',
  width: '22em',
};

const header = {
  color: 'rgb(96,97,98)',
  font: 'bold 20px serif',
  textAlign: 'center',
};

function TemperatureContainer(props) {
  const { degree, type } = props;

  return (
    <div style={innerContainer}>
      <div style={header}>{type} temperature</div>
      <div style={sensor}>{degree === undefined ? `?` : `${degree} °C`}</div>
    </div>
  );
}

TemperatureContainer.propTypes = {
  degree: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};

export default withStyles(s)(TemperatureContainer);
