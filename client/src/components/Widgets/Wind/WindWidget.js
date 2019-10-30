import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { apiURL } from '../../../constants';

class WindWidget extends React.Component {
  state = {
    events: [],
    info: {},
  };

  componentDidMount() {
    const queries = [
      axios.get(`${apiURL}/wind/events`, {
        params: {
          from: moment()
            .local()
            .toJSON(),
          to: moment()
            .subtract(1, 'minute')
            .local()
            .toJSON(),
        },
      }),
      axios.get(`${apiURL}/wind`),
    ];

    Promise.all(queries)
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(([{ data: events }, { data: info }]) =>
        this.setState({ events, info }),
      )
      .catch(console.error);
  }

  render() {
    const { events, info } = this.state;
    return (
      <div>
        <h5>Wind Sensor</h5>
        <div>{info.Status}</div>
        <div>Current wind speed: {events[0] && events.slice(-1)[0].power}</div>
        <div>
          Current wind direction: {events[0] && events.slice(-1)[0].direction}
        </div>
      </div>
    );
  }
}

export default WindWidget;
