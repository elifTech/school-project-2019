/* eslint-disable react/no-unused-state */
/* eslint-disable no-magic-numbers */
import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import { connect } from 'react-redux';
import style from './carbon-widget.css';
import { getWidgetsData } from '../../../actions/carbonmonoxide';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
class Widget extends Component {
  static propTypes = {
    info: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Type: PropTypes.string.isRequired,
      status: PropTypes.number.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      datasets: [
        {
          backgroundColor: ['#FBBC15', '#179C52', '#EA4325'],
          data: [
            getRandomInt(100, 150),
            getRandomInt(500, 800),
            getRandomInt(50, 100),
          ],
          hoverBackgroundColor: ['#F7D529', '#34A853', '#FF3E30'],
        },
      ],
      labels: ['Attention', 'Good', 'Danger'],
    };
  }

  // componentDidMount() {
  //   const { dispatchWidgetData } = this.props;
  //   dispatchWidgetData();
  // }

  render() {
    const { info } = this.props;
    // dispatchWidgetData();
    return (
      <div className={style.card}>
        <div className={style.cardHeader}>Carbon Monoxide Sensor</div>
        <div className={style.cardMain}>
          <Doughnut data={this.state} />
          <div className={style.mainDescription}>
            Status: {this.parseStatus(info.status)}
          </div>
        </div>
      </div>
    );
  }

  parseStatus = status => {
    switch (status) {
      case 0:
        return 'Critical';
      default:
        return 'Good';
    }
  };
}

Widget.whyDidYouRender = true;
export default connect(
  ({ carbonSensor: { info, events, error, isLoading } }) => ({
    error,
    events,
    info,
    isLoading,
  }),
  { dispatchWidgetData: getWidgetsData },
)(withStyles(style)(Widget));
