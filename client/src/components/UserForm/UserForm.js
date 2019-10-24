import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Field, reduxForm } from 'redux-form';
import s from './user-form.css';

const UserForm = ({ handleSubmit }) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Field name="email" component="input" type="text" placeholder="Email" />
        <Field
          name="password"
          component="input"
          type="password"
          placeholder="Password"
        />
        <button type="submit" label="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default withStyles(s)(reduxForm({ form: 'user-form' })(UserForm));
