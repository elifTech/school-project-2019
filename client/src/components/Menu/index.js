import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/withStyles';
import Hamburger from 'react-hamburger-menu';
import MenuItem from './MenuItem';

import s from './Menu.css';

class Menu extends React.Component {
  static propTypes = {
    currentTab: PropTypes.string.isRequired,
  };

  // eslint-disable-next-line react/state-in-constructor
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
        <div className={`${s.menuItems} ${isMenuOpen && s.menuItemsActive}`}>
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
            <svg
              width="18px"
              height="18px"
              fill="rgba(255, 255, 255, .6)"
              viewBox="0 0 496 512"
            >
              <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm193.2 152h-82.5c-9-44.4-24.1-82.2-43.2-109.1 55 18.2 100.2 57.9 125.7 109.1zM336 256c0 22.9-1.6 44.2-4.3 64H164.3c-2.7-19.8-4.3-41.1-4.3-64s1.6-44.2 4.3-64h167.4c2.7 19.8 4.3 41.1 4.3 64zM248 40c26.9 0 61.4 44.1 78.1 120H169.9C186.6 84.1 221.1 40 248 40zm-67.5 10.9c-19 26.8-34.2 64.6-43.2 109.1H54.8c25.5-51.2 70.7-90.9 125.7-109.1zM32 256c0-22.3 3.4-43.8 9.7-64h90.5c-2.6 20.5-4.2 41.8-4.2 64s1.5 43.5 4.2 64H41.7c-6.3-20.2-9.7-41.7-9.7-64zm22.8 96h82.5c9 44.4 24.1 82.2 43.2 109.1-55-18.2-100.2-57.9-125.7-109.1zM248 472c-26.9 0-61.4-44.1-78.1-120h156.2c-16.7 75.9-51.2 120-78.1 120zm67.5-10.9c19-26.8 34.2-64.6 43.2-109.1h82.5c-25.5 51.2-70.7 90.9-125.7 109.1zM363.8 320c2.6-20.5 4.2-41.8 4.2-64s-1.5-43.5-4.2-64h90.5c6.3 20.2 9.7 41.7 9.7 64s-3.4 43.8-9.7 64h-90.5z" />
            </svg>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer noopener"
            className={s.menuSocialIcon}
          >
            <svg
              width="18px"
              height="18px"
              fill="rgba(255, 255, 255, .6)"
              viewBox="0 0 512 512"
            >
              <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  menuItems = [
    {
      icon: (
        <svg
          viewBox="0 0 512 512"
          width="20px"
          height="20px"
          fill="rgba(255, 255, 255, .8)"
        >
          <path d="M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM240 448H48c-8.837 0-16-7.163-16-16V96h208v352zm240-16c0 8.837-7.163 16-16 16H272V96h208v336z" />
        </svg>
      ),
      path: '',
      text: 'Dashboard',
    },
    {
      icon: (
        <svg
          viewBox="0 0 256 512"
          width="20px"
          height="27px"
          fill="rgba(255, 255, 255, .8)"
        >
          <path d="M176 384c0 26.51-21.49 48-48 48s-48-21.49-48-48c0-20.898 13.359-38.667 32-45.258V272c0-8.837 7.163-16 16-16s16 7.163 16 16v66.742c18.641 6.591 32 24.36 32 45.258zm48-84.653c19.912 22.564 32 52.195 32 84.653 0 70.696-57.302 128-128 128-.299 0-.61-.001-.909-.003C56.789 511.509-.357 453.636.002 383.333.166 351.135 12.225 321.756 32 299.347V96c0-53.019 42.981-96 96-96s96 42.981 96 96v203.347zM224 384c0-39.894-22.814-62.144-32-72.553V96c0-35.29-28.71-64-64-64S64 60.71 64 96v215.447c-9.467 10.728-31.797 32.582-31.999 72.049-.269 52.706 42.619 96.135 95.312 96.501L128 480c52.935 0 96-43.065 96-96z" />
        </svg>
      ),
      path: 'temperature',
      text: 'Temperature',
    },
    {
      icon: (
        <svg
          viewBox="0 0 512 512"
          width="25px"
          height="22px"
          fill="rgba(255, 255, 255, .8)"
        >
          <path d="M8 224h344c59.8 0 106.8-54.6 93.8-116.7-7.6-36.3-36.9-65.6-73.2-73.2-59.1-12.3-111.5 29.8-116.3 85.4-.4 4.6 3.5 8.4 8 8.4h16.2c4.2 0 7.4-3.3 7.9-7.4 4.3-36.6 39.5-63.8 78.7-54.8 23.1 5.3 41.8 24.1 47.2 47.2 9.6 41.8-22.1 79.1-62.3 79.1H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8zm148 32H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h149.1c33.4 0 63.3 24.4 66.5 57.6 3.7 38.1-26.3 70.4-63.7 70.4-32.8 0-59.9-24.8-63.6-56.5-.5-4.2-3.7-7.4-7.9-7.4h-16c-4.6 0-8.4 3.9-8 8.4 4.3 49.1 45.5 87.6 95.6 87.6 54 0 97.6-44.6 96-98.9-1.6-52.7-47.5-93.2-100-93.2zm239.3 0H243.8c10.5 9.2 19.4 19.9 26.4 32h126.2c41.8 0 79.1 30.4 83.2 72 4.7 47.7-32.9 88-79.6 88-36.5 0-67.3-24.5-76.9-58-1-3.5-4-6-7.7-6h-16.1c-5 0-9 4.6-7.9 9.5C302.9 443 347 480 400 480c63 0 113.9-52 112-115.4-1.9-61.3-55.4-108.6-116.7-108.6z" />
        </svg>
      ),
      path: 'wind',
      text: 'Wind',
    },
    {
      icon: (
        <svg
          viewBox="0 0 576 512"
          width="27px"
          height="22px"
          fill="rgba(255, 255, 255, .8)"
        >
          <path d="M558.3 333.6c-9.6-8.6-22.1-13.4-35.2-13.4-12.5 0-24.8 4.3-34.6 12.2l-61.6 49.3c-1.9 1.5-4.2 2.3-6.7 2.3h-41.6c4.6-9.6 6.5-20.7 4.8-32.3-4-27.9-29.6-47.7-57.8-47.7H181.3c-20.8 0-41 6.7-57.6 19.2L85.3 352H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h88l46.9-35.2c11.1-8.3 24.6-12.8 38.4-12.8H328c13.3 0 24 10.7 24 24s-10.7 24-24 24h-88c-8.8 0-16 7.2-16 16s7.2 16 16 16h180.2c9.7 0 19.1-3.3 26.7-9.3l61.6-49.2c4.2-3.4 9.5-5.2 14.6-5.2 5 0 9.9 1.7 13.8 5.2 10.1 9.1 9.3 24.5-.9 32.6l-100.8 80.7c-7.6 6.1-17 9.3-26.7 9.3H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h400.5c17 0 33.4-5.8 46.6-16.4L556 415c12.2-9.8 19.5-24.4 20-40s-6-30.8-17.7-41.4zM288 256c53 0 96-42.1 96-94 0-40-57.1-120.7-83.2-155.6-3.2-4.3-8-6.4-12.8-6.4s-9.6 2.1-12.8 6.4C249.1 41.3 192 122 192 162c0 51.9 43 94 96 94zm0-213c44.1 61.4 64 103.5 64 119 0 34.2-28.7 62-64 62s-64-27.8-64-62c0-15.5 19.9-57.6 64-119z" />
        </svg>
      ),
      path: 'water-quality',
      text: 'Water Quality',
    },
  ];
}

export default connect(
  ({ menu: { currentTab } }) => ({ currentTab }),
  null,
)(withStyles(s)(Menu));
