import React from 'react';
import { withFormik, Field } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import classNames from "classnames";
import { changePermissionForUser } from '../../../../store/actions/users';

const InputFeedbackModal = ({ error }) =>
  error ? <div className={("input-group")}>{error}</div> : null;

// Radio input
const RadioButtonModal = ({
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
const RadioButtonModalGroup = ({
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
      {touched && <InputFeedbackModal error={error} />}
    </div>
  );
};




class PermissionsModal extends React.Component {
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

    // console.log('this.props.rules', this.props.rules)

    return (
      <form onSubmit={handleSubmit}>
        <div className=''>
          <label className='settings-box-label'>Permissions</label>
          <br />
          <div className='setting-input-wrapper'>

            <RadioButtonModalGroup
              id="changePermissions"
              value={values.changePermissions}
              error={errors.changePermissions}
              touched={touched.changePermissions}
            >

              <div className='checkbox-wrapper'>
                <Field
                  component={RadioButtonModal}
                  name="changePermissions"
                  id="View"
                  label="View Projects and Funnels"
                />
              </div>

              <div className='checkbox-wrapper'>
                <Field
                  component={RadioButtonModal}
                  name="changePermissions"
                  id="View,Edit"
                  label="View/Edit Projects and Funnels"
                />
              </div>

              <div className='checkbox-wrapper'>
                <Field
                  component={RadioButtonModal}
                  name="changePermissions"
                  id="View,Edit,Create"
                  label="View/Edit/Create Projects and Funnels"
                />
              </div>

            </RadioButtonModalGroup>

            {
              this.props.messageChangePermissionForUser &&
              <div className="input-group">Oops! {this.props.messageChangePermissionForUser}</div>
            }

            <button
              className='btn btn-1 generate-link-user-settings'
              type="submit"
              disabled={isSubmitting}
            >
              Save
            </button>

          </div>
        </div>
      </form>
    );
  }
};

const formikEnhancerModal = withFormik({
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    changePermissions: Yup.string().required("A radio option is required"),
  }),
  mapPropsToValues: (props) => {
    const rules = props.rules
    return {
      changePermissions: rules,
    }
  },
  handleSubmit: (payload, { props, setSubmitting }) => {
    console.log('changePermissions', payload)
    props.dispatch({ type: 'GENERATED_LINK_TO_ADD_USER_RESET' });
    props.changePermissionForUser(payload, props.id) 
    setSubmitting(false);
    props.handleHideModal()
  },
  displayName: 'SettingsPermissionsFormModal',
})(PermissionsModal);

const mapStateToProps = state => {
  return {
    messageLinkToAddUser: state.users.messageLinkToAddUser,
    messageChangePermissionForUser: state.users.messageChangePermissionForUser,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch: item => dispatch(item),
    changePermissionForUser: (data, id) => dispatch(changePermissionForUser(data, id))
  }
}

const SettingsPermissionsFormModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(formikEnhancerModal)

export default SettingsPermissionsFormModal;