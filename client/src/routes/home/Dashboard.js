import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import CarbonWidget from '../carbonsensor/CarbonWidget/carbon-widget';
import s from './Home.css';

function Dashboard() {
  return (
    <div className={s.root}>
      <div className={s.container}>Dashboard</div>
      <div className="row mb-12">
        <div className="col-sm-6">
          <CarbonWidget /> <CarbonWidget />
        </div>
        <div className="col-sm-6">
          <CarbonWidget /> <CarbonWidget />
        </div>
      </div>
    </div>
  );
}
Dashboard.whyDidYouRender = true;
export default withStyles(s)(React.memo(Dashboard));
