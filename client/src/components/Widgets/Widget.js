import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import Switch from 'react-switch';
import { Spinner, Alert, Row, Col } from 'react-bootstrap';
import style from './Widget.css';

class Widget extends Component {
  static propTypes = {
    error: PropTypes.string.isRequired,
  };

  render() {
    const { error } = this.props;

    return (
      <div className={style.container}>
        {error && (
          <Alert variant="danger">
            {error}
            <Spinner animation="border" role="status" />
          </Alert>
        )}
        <div className={style.innerContainer}>
          <Row>
            <Col md={8} className={style.header}>
              Sensors Name
            </Col>
            <Col md={2} className="ml-4">
              <Switch
                handleDiameter={20}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                height={15}
                width={40}
              />
            </Col>
          </Row>
          <div className={style.sensor}>
            <b>Sensors information:</b>
          </div>
        </div>
      </div>
    );
  }

  statusOnClick(status) {
    return () => this.handleOnClick(status);
  }

  checkStatus = status => {
    return status === 1 ? false : status === 0;
  };
}

Widget.whyDidYouRender = true;
export default withStyles(style)(Widget);
