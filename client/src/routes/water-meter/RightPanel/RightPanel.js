import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import WaterMeterStatus from '../WaterMeterStatus';
import s from './RightPanel.css';

class RightPanel extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
  };

  render() {
    const { name } = this.props;
    return (
      <div>
        <WaterMeterStatus name={name} />
        <div className={s.info}>Some useful info</div>
      </div>
    );
  }
}

export default connect(
  ({
    waterMeter: {
      info: { Name },
    },
  }) => ({
    name: Name,
  }),
  null,
)(withStyles(s)(RightPanel));