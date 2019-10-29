import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import s from './Dashboard.css';
import WaterQualityWidget from '../../components/Widgets/WaterQualityWidget/WaterQualityWidget';
import CarbonWidget from '../carbonsensor/CarbonWidget/carbon-widget';

class Dashboard extends PureComponent {
  static propTypes = {
    resetInterval: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    const { resetInterval } = this.props;
    resetInterval();
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>Dashboard</div>
        <div className="row mb-12">
          <div className="col-sm-4">
            <WaterQualityWidget />
          </div>
          <div className="col-sm-4">
            <CarbonWidget />
          </div>
        </div>
      </div>
    );
  }
}
Dashboard.whyDidYouRender = true;
export default withStyles(s)(React.memo(Dashboard));
