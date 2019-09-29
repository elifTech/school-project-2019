/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import s from './Home.css';

const time = 1000;
const color = 'rgba(75,192,192,1)';
class PostList extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      lineData: {},
    };
  }

  async componentDidMount() {
    await setInterval(() => {
      axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
      axios
        .get(`http://localhost:8080/sensor/carbon/ping`)
        .then(response => {
          const Sensor = response.data;
          const sensorsignal = [];
          const sensorsid = [];
          const CurrentTime = [];
          const sensorname = [];
          Sensor.forEach(element => {
            sensorname.push(element.name);
            sensorsignal.push(element.signal);
            sensorsid.push(element.DeviceID);
            CurrentTime.push(element.Created);
          });

          this.setState({
            lineData: {
              datasets: [
                {
                  backgroundColor: 'rgba(75,192,192,0.4)',
                  borderCapStyle: 'butt',
                  borderColor: color,
                  borderDash: [],
                  borderDashOffset: 0,
                  borderJoinStyle: 'miter',
                  data: sensorsignal,
                  fill: false,
                  label: 'Carbon Monoxide',
                  lineTension: 0.1,
                  maintainAspectRatio: true,
                  pointBackgroundColor: '#fff',
                  pointBorderColor: color,
                  pointBorderWidth: 1,
                  pointHitRadius: 10,
                  pointHoverBackgroundColor: color,
                  pointHoverBorderColor: 'rgba(220,220,220,1)',
                  pointHoverBorderWidth: 2,
                  pointHoverRadius: 5,
                  pointRadius: 1,
                },
              ],
              labels: CurrentTime,
            },
          });
        })
        .catch(console.error());
    }, time);
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Hello, Eliftech School</h1>
          <div>
            {' '}
            <Line data={this.state.lineData} />
          </div>
        </div>
      </div>
    );
  }
}

PostList.whyDidYouRender = true;
export default withStyles(s)(React.memo(PostList));
