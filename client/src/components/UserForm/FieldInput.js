import React from 'react';
import PropTypes from 'prop-types';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import withStyles from 'isomorphic-style-loader/withStyles';
import FormControl from 'react-bootstrap/FormControl';

const FieldInput = ({ input: { value, onChange }, type, placeholder }) => {
  return (
    <FormControl
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

FieldInput.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default withStyles(bootstrap)(FieldInput);
