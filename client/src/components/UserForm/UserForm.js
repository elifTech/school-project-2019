import React from 'react';
import PropTypes from 'prop-types';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Field, reduxForm } from 'redux-form';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FieldInput from './FieldInput';

const UserForm = ({ handleSubmit, submitText }) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Email address</Form.Label>
        <Field
          name="email"
          component={FieldInput}
          type="email"
          placeholder="Enter email"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Field
          name="password"
          component={FieldInput}
          type="password"
          placeholder="Enter password"
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        {submitText || 'Submit'}
      </Button>
    </Form>
  );
};

UserForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string.isRequired,
};

export default withStyles(bootstrap)(
  reduxForm({ form: 'user-form' })(UserForm),
);
