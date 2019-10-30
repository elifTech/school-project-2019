import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/withStyles';
import classNames from 'classnames';
import Hamburger from 'react-hamburger-menu';
import Button from 'react-bootstrap/Button';
import MenuItem from './MenuItem/MenuItem';
import { signout } from '../../actions/user';

import s from './Menu.css';
import dashboardIcon from '../../assets/dashboard.svg';
import temperatureIcon from '../../assets/temp.svg';
import windIcon from '../../assets/wind.svg';
import qualityIcon from '../../assets/quality.svg';
import carbonIcon from '../../assets/carbon.svg';
import waterMeterIcon from '../../assets/water-meter.svg';

class Menu extends React.Component {
  static propTypes = {
    currentTab: PropTypes.string.isRequired,
    signoutUser: PropTypes.func.isRequired,
  };

  state = {
    isMenuOpen: false,
  };

  render() {
    const { currentTab, signoutUser } = this.props;
    const { isMenuOpen } = this.state;
    return (
      <div className={s.menu}>
        <div className={s.menuLogo}>IoT App</div>
        <div className={s.menuHamburger}>
          <Hamburger
            isOpen={isMenuOpen}
            menuClicked={this.onMenuClick}
            width={25}
            height={15}
            color="#3f496f"
          />
        </div>
        <div
          className={classNames(s.menuItems, {
            [s.menuItemsActive]: isMenuOpen,
          })}
        >
          {this.menuItems.map(item => (
            <MenuItem
              key={item.text}
              item={item}
              isActive={currentTab === item.text}
              closeMenu={this.onMenuClick}
            />
          ))}
        </div>
        {process.env.BROWSER && localStorage.getItem('token') && (
          <Button
            variant="outline-light"
            className={s.signout}
            onClick={signoutUser}
          >
            Sign out
          </Button>
        )}
      </div>
    );
  }

  onMenuClick = () => {
    const { isMenuOpen } = this.state;
    this.setState({ isMenuOpen: !isMenuOpen });
  };

  menuItems = [
    {
      icon: dashboardIcon,
      path: '',
      text: 'Dashboard',
    },
    {
      icon: temperatureIcon,
      path: 'temperaturesensor',
      text: 'Temperature',
    },
    {
      icon: windIcon,
      path: 'wind',
      text: 'Wind',
    },
    {
      icon: qualityIcon,
      path: 'water-quality',
      text: 'Water Quality',
    },
    {
      icon: carbonIcon,
      path: 'carbonmonoxide',
      text: 'Carbon Monoxide',
    },
    {
      icon: waterMeterIcon,
      path: 'water-meter',
      text: 'Water Cons',
    },
  ];
}

export default connect(
  ({ menu: { currentTab } }) => ({ currentTab }),
  { signoutUser: signout },
)(withStyles(s)(Menu));
