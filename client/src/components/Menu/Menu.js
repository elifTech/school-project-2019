import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/withStyles';
import classNames from 'classnames';
import Hamburger from 'react-hamburger-menu';
import MenuItem from './MenuItem/MenuItem';

import s from './Menu.css';
import dashboardIcon from '../../assets/dashboard.svg';
import temperatureIcon from '../../assets/temp.svg';
import windIcon from '../../assets/wind.svg';
import qualityIcon from '../../assets/quality.svg';
import websiteIcon from '../../assets/website.svg';
import facebookIcon from '../../assets/facebook.svg';
import waterMeterIcon from '../../assets/water-meter.svg';

class Menu extends React.Component {
  static propTypes = {
    currentTab: PropTypes.string.isRequired,
  };

  state = {
    isMenuOpen: false,
  };

  onMenuClick = () => {
    const { isMenuOpen } = this.state;
    this.setState({ isMenuOpen: !isMenuOpen });
  };

  render() {
    const { currentTab } = this.props;
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
        <div className={s.menuSocial}>
          <a
            href="https://google.com"
            target="_blank"
            rel="noreferrer noopener"
            className={s.menuSocialIcon}
          >
            <img src={websiteIcon} alt="website" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer noopener"
            className={s.menuSocialIcon}
          >
            <img src={facebookIcon} alt="facebook" />
          </a>
        </div>
      </div>
    );
  }

  menuItems = [
    {
      icon: dashboardIcon,
      path: '',
      text: 'Dashboard',
    },
    {
      icon: temperatureIcon,
      path: 'temperature',
      text: 'Temperature',
    },
    {
      icon: windIcon,
      path: 'wind',
      text: 'Wind',
    },
    {
      icon: qualityIcon,
      path: 'waterquality',
      text: 'Water Quality',
    },
    {
      icon: waterMeterIcon,
      path: 'water-meter',
      text: 'Water Consumption',
    },
  ];
}

export default connect(
  ({ menu: { currentTab } }) => ({ currentTab }),
  null,
)(withStyles(s)(Menu));
