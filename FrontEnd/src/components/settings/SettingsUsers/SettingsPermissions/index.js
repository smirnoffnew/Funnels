import React from 'react';
import { withFormik, Field } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import classNames from "classnames";
import { generatingLinkToAddUser } from '../../../../store/actions/users';

const InputFeedback = ({ error }) =>
  error ? <div className={("input-group")}>{error}</div> : null;

// Radio input
const RadioButton = ({
  field: { name, value, onChange, onBlur },
  id,
  label,
  className,
  ...props
}) => {
  return (
    <div>
      <label className="container-checkbox">{label}
        <input
          name={name}
          id={id}
          type="radio"
          value={id} // could be something else for output?
          checked={id === value}
          onChange={onChange}
          onBlur={onBlur}
          {...props}
        />
        <span className="checkmark"></span>
      </label>
    </div>
  );
};

// Radio group
const RadioButtonGroup = ({
  value,
  error,
  touched,
  id,
  label,
  className,
  children
}) => {
  const classes = classNames(
    "input-group",
    {
      '': value || (!error && touched), // handle prefilled or user-filled
      "has-error": !!error && touched
    },
    className
  );

  return (
    <div className={classes}>
      {children}
      {touched && <InputFeedback error={error} />}
    </div>
  );
};




class Permissions extends React.Component {
  render() {
    const {
      values,
      touched,
      errors,
      // dirty,
      // handleChange,
      // handleBlur,
      handleSubmit,
      // handleReset,
      isSubmitting,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className='settings-box'>
          <label className='settings-box-label'>Permissions</label>
          <br />
          <div className='setting-input-wrapper'>

            <RadioButtonGroup
              id="setPermissions"
              value={values.setPermissions}
              error={errors.setPermissions}
              touched={touched.setPermissions}
            >

              <div className='checkbox-wrapper'>
                <Field
                  component={RadioButton}
                  name="setPermissions"
                  id="View"
                  label="View Projects and Funnels"
                />
              </div>

              <div className='checkbox-wrapper'>
                <Field
                  component={RadioButton}
                  name="setPermissions"
                  id="View,Edit"
                  label="View/Edit Projects and Funnels"
                />
              </div>

              <div className='checkbox-wrapper'>
                <Field
                  component={RadioButton}
                  name="setPermissions"
                  id="View,Edit,Create"
                  label="View/Edit/Create Projects and Funnels"
                />
              </div>

            </RadioButtonGroup>

            {
              this.props.messageLinkToAddUser &&
                <div className="input-group">Oops! {this.props.messageLinkToAddUser}</div>
            }

            <button
              className='btn btn-1 generate-link-user-settings'
              type="submit"
              disabled={isSubmitting}
            >
              Generate Link
            </button>

          </div>
        </div>
      </form>
    );
  }
};

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    setPermissions: Yup.string().required("A radio option is required"),
  }),
  mapPropsToValues: () => ({
    setPermissions: '',
  }),
  handleSubmit: (payload, { props, setSubmitting }) => {
    // console.log('setPermissions', payload)
    props.dispatch({ type: 'GENERATED_LINK_TO_ADD_USER_RESET' });
    props.generatingLinkToAddUser(payload)
    setSubmitting(false);
  },
  displayName: 'SettingsPermissionsForm',
})(Permissions);

const mapStateToProps = state => {
  return {
    messageLinkToAddUser: state.users.messageLinkToAddUser,
    messageChangePermissionForUser: state.users.messageChangePermissionForUser,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch: item => dispatch(item),
    generatingLinkToAddUser: (data) => dispatch(generatingLinkToAddUser(data))
  }
}

const SettingsPermissionsForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(formikEnhancer)

export default SettingsPermissionsForm;