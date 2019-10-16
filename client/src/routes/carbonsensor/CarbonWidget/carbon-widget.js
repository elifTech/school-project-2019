/* eslint-disable react/no-unused-state */
/* eslint-disable no-magic-numbers */
import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import withStyles from 'isomorphic-style-loader/withStyles';
import style from './carbon-widget.css';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
class Widget extends Component {
  static propTypes = {};

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

  render() {
    return (
      <div className={style.card}>
        <div className={style.cardHeader}>Carbon Monoxide Sensor</div>
        <div className={style.cardMain}>
          <Doughnut data={this.state} />
          <div className={style.mainDescription}>Level: Good</div>
        </div>
      </div>
    );
  }
}

Widget.whyDidYouRender = true;
export default withStyles(style)(React.memo(Widget));
