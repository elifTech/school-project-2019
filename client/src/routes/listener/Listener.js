import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/withStyles';
import { getRecentTracks } from '../../actions/music';
import Track from './Track';
import style from './Listener.css';

class Listener extends PureComponent {
  static propTypes = {
    error: PropTypes.string,
    recentTracks: PropTypes.shape({
      '@attr': PropTypes.shape({
        user: PropTypes.string.isRequired,
      }).isRequired,
      track: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.shape({
            uts: PropTypes.string.isRequired,
          }).isRequired,
        }),
      ).isRequired,
    }),
    username: PropTypes.string,
  };

  static defaultProps = {
    error: undefined,
    recentTracks: {},
    username: 'Unknown',
  };

  render() {
    const { error, recentTracks, username: requestedUsername } = this.props;
    const {
      '@attr': { user: username } = {},
      track: tracks = [],
    } = recentTracks;
    return (
      <article className={style.root}>
        User: {username || requestedUsername}
        {error && <p className={style.error}>{error}</p>}
        <div className={style.wrapper}>
          {tracks.map(trackItem => {
            const key =
              (trackItem && trackItem.date && trackItem.date.uts) ||
              trackItem.mbid ||
              trackItem.url;
            return <Track key={key} track={trackItem} />;
          })}
        </div>
      </article>
    );
  }
}

export default connect(
  state => ({
    error: state.music.error,
    recentTracks: state.music.recentTracks,
    username: state.user.username,
  }),
  {
    dispatchGetRecentTracks: getRecentTracks,
  },
)(withStyles(style)(Listener));
