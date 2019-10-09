import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import s from './ListenerForm.css';

function normalizeUsername(value) {
  return String(value || '').toLowerCase();
}

function validate(values) {
  const errors = {};
  if (!values['username-input']) {
    errors['username-input'] = 'Required';
  }
  if (!values['api-key-input']) {
    errors['api-key-input'] = 'Required';
  }
  return errors;
}

function MyField({ input, name, label, value, meta: { touched, error } }) {
  console.info(name, value);
  return (
    <>
      <label htmlFor={name}>
        {label}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <input id={name} type="text" value={value} {...input} />
      </label>
      {touched && error && <span className="error">{error}</span>}
    </>
  );
}
MyField.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  input: PropTypes.any.isRequired,
  label: PropTypes.string,
  meta: PropTypes.shape({
    error: PropTypes.string,
    touched: PropTypes.bool.isRequired,
  }).isRequired,
  name: PropTypes.string,
  value: PropTypes.string,
};
MyField.defaultProps = {
  label: 'Field',
  name: '',
  value: '',
};

class ListenerForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  };

  static whyDidYouRender = true;

  render() {
    const { handleSubmit } = this.props;
    return (
      <form className={s.userForm} onSubmit={handleSubmit}>
        <Field
          component={MyField}
          name="username-input"
          normalize={normalizeUsername}
          label="Username"
          type="text"
          //   value={username}
        />
        <Field
          component={MyField}
          name="api-key-input"
          label="API key"
          type="text"
          //   value={apiKey}
        />
        <button type="submit">Fetch data</button>
      </form>
    );
  }
}

const ReduxListenerForm = reduxForm({
  form: 'listener',
  initialValues: {
    'api-key-input': '',
    'username-input': '',
  },
  validate,
})(ListenerForm);

export default withStyles(s)(
  connect(
    // mapStateToProps
    function mapStateToProps(state) {
      const {
        form: {
          listener: {
            values: {
              'api-key-input': apiKey,
              'username-input': username,
            } = {},
          } = {},
        } = {},
      } = state;
      return {
        apiKey,
        username,
      };
    },
  )(ReduxListenerForm),
);
