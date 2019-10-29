import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { changeUserPassword } from '../../../store/actions/settings'

class ChangeUserPassword extends React.Component {
  render() {
    const {
      values,
      touched,
      errors,
      // dirty,
      handleChange,
      handleBlur,
      handleSubmit,
      // handleReset,
      // isSubmitting,
    } = this.props;
    return (
      <form onSubmit={handleSubmit} className="settings-box-form">

        <div className='settings-box'>
          <label className='settings-box-label'>Reset Your Password</label>
          <br />

          <div className='setting-input-wrapper'>
            <label className='settings-label-input'>
              Current Password
            </label>
            <br />
            <input
              id="currentPassword"
              placeholder="Enter your current password"
              type="password"
              value={values.currentPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.currentPassword && touched.currentPassword && (
              <div className={`input-group ${errors.currentPassword && touched.currentPassword ? 'has-error' : ''}`}>{errors.currentPassword}</div>
            )}
          </div>


          <div className='settings-password-change-box'>
            <div className='setting-input-wrapper'>
              <label className='settings-label-input'>
                New Password
            </label>
              <br />
              <input
                id="newPassword"
                placeholder="Enter your new password"
                type="password"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className='settings-password-change-input'
              />
              {errors.newPassword && touched.newPassword && (
                <div className={`input-group ${errors.newPassword && touched.newPassword ? 'has-error' : ''}`}>{errors.newPassword}</div>
              )}
            </div>

            <div className='setting-input-wrapper'>
              <label className='settings-label-input'>
                Confirm Password
            </label>
              <br />
              <input
                id="newPasswordConfirm"
                placeholder="Confirm your new password"
                type="password"
                value={values.newPasswordConfirm}
                onChange={handleChange}
                onBlur={handleBlur}
                className='settings-password-change-input'
              />
              {errors.newPasswordConfirm && touched.newPasswordConfirm && (
                <div className={`input-group ${errors.newPasswordConfirm && touched.newPasswordConfirm ? 'has-error' : ''}`}>{errors.newPasswordConfirm}</div>
              )}
            </div>
          </div>


          {this.props.changeUserPasswordMessage && this.props.changeUserPasswordMessage.length > 0 && (
            <div className={`input-group`}>{this.props.changeUserPasswordMessage}</div>
          )}

          <button className='btn btn-1' type="submit"
            style={{
              width: '200px',
              margin: 'auto',
              display: 'block',
              marginBottom: '20px',
            }}
          >Enter a Valid Password</button>
        </div>

      </form>
    );
  }
};

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    currentPassword: Yup.string()
      .min(8, 'Minimum 8 letters')
      .max(25, 'Maximum 25 letters')
      .required('Password is required.'),
    newPassword: Yup.string()
      .min(8, 'Minimum 8 letters')
      .max(25, 'Maximum 25 letters')
      .required('Password is required.'),
    newPasswordConfirm: Yup.string()
      .oneOf([Yup.ref('newPassword')], "Passwords must match")
      .required('Password confirm is required')
  }),
  mapPropsToValues: () => ({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  }),
  handleSubmit: (payload, { props, setSubmitting }) => {
    props.changeUserPassword(payload);
    setSubmitting(false);
  },
  displayName: 'ChangeUserPassword',
})(ChangeUserPassword);

const mapStateToProps = state => {
  return {
    changeUserPasswordMessage: state.settings.settingsMessagePassword,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeUserPassword: data => dispatch(changeUserPassword(data)),
  }
}

const ChangePassword = connect(
  mapStateToProps,
  mapDispatchToProps,
)(formikEnhancer)

export default ChangePassword;