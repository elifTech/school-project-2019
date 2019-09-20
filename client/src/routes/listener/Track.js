import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import style from './Track.css';

function Track({ track }) {
  if (!track) return null;
  const {
    album: { '#text': album = '' },
    artist: { '#text': artist = '' },
    image: images,
    name = '',
  } = track;
  const imageUrl = images
    ? images.find(imageItem => imageItem.size === 'extralarge')['#text']
    : undefined;
  return (
    <div className={style.root}>
      <div
        className={style.sublay}
        style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined }}
      />
      <div>
        <h1>{artist}</h1>
      </div>
      <div>
        <h3>{album}</h3>
      </div>
      <div>
        <h2>{name}</h2>
      </div>
    </div>
  );
}

const musicbrainzShape = PropTypes.shape({
  '#text': PropTypes.string.isRequired,
});

Track.propTypes = {
  track: PropTypes.shape({
    album: musicbrainzShape.isRequired,
    artist: musicbrainzShape.isRequired,
    image: PropTypes.arrayOf(
      PropTypes.shape({
        size: PropTypes.string.isRequired,
        '#text': PropTypes.string.isRequired,
      }),
    ).isRequired,
    name: PropTypes.string.isRequired,
  }),
};
Track.defaultProps = {
  track: null,
};
export default withStyles(style)(Track);
