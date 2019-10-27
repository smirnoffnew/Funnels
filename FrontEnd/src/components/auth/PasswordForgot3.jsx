import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { passwordForgotUserStep3 } from '../../store/actions/auth'
import './Sign.css'
import logo from '../../assets/Logo_invert.png'

let params = (new URL(document.location)).searchParams;
let token = params.get('token'); // is the string "Jonathan Smith".

class PasswordForgot3 extends React.Component {
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
      isSubmitting,
    } = this.props;



    return (
      <div className='wrapper'>
        <img className='signin-logo' src={logo} alt='logo' />
        <p className='top-text-first'>Reset Your Password</p>
        <div className='container'>
          <form onSubmit={handleSubmit}>
            <div className='form-container'>
              <label htmlFor="password" className='label'>
                New Password
              </label>
              <input
                id="password"
                placeholder="Enter your password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.password && touched.password && (
                <div className={`input-group ${errors.password && touched.password ? 'has-error' : ''}`}>{errors.password}</div>
              )}

              <label htmlFor="passwordConfirm" className='label'>
                Confirm Password
              </label>
              <input
                id="passwordConfirm"
                placeholder="Confirm your password"
                type="password"
                value={values.passwordConfirm}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.passwordConfirm && touched.passwordConfirm && (
                <div className={`input-group ${errors.passwordConfirm && touched.passwordConfirm ? 'has-error' : ''}`}>{errors.passwordConfirm}</div>
              )}

              {/* Server error message */}
              {this.props.errorMessage && this.props.errorMessage &&
                <div className="input-group">Oops! {this.props.errorMessage}</div>}

              <button className="btn btn-1" type="submit" disabled={isSubmitting}>
                Enter A Valid Password
              </button>
              
            </div>
          </form>
         
        </div>
         <div className='empty-space'/>
      </div>
    );
  }
};

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    password: Yup.string()
      .min(8, 'Minimum 8 letters')
      .max(25, 'Maximum 25 letters')
      .required('Password is required.'),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password')], "Passwords must match")
      .required('Password confirm is required')
  }),
  mapPropsToValues: () => ({
    password: '',
    passwordConfirm: '',
  }),
  handleSubmit: (payload, { props, setSubmitting }) => {
    // console.log(props)
    props.passwordForgotUserStep3(payload, token);
    setSubmitting(false);
  },
  displayName: 'PasswordForgot3',
})(PasswordForgot3);

const mapStateToProps = state => {
  return { errorMessage: state.auth.passwordForgotError }
}

const mapDispatchToProps = dispatch => {
  return {
    passwordForgotUserStep3: (arr, token) => dispatch(passwordForgotUserStep3(arr, token)),
  }
}

const PasswordForgot = connect(
  mapStateToProps,
  mapDispatchToProps,
)(formikEnhancer)

export default PasswordForgot;