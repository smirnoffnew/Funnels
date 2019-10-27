import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { passwordForgotUserStep1 } from '../../store/actions/auth'
import './Sign.css'
import logo from '../../assets/Logo_invert.png'

class PasswordForgot1 extends React.Component {
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
              <label htmlFor="email" className='label'>
                Email
              </label>
              <input
                id="email"
                placeholder="Email Address"
                type="text"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && touched.email && (
                <div className={`input-group ${errors.email && touched.email ? 'has-error' : ''}`}>{errors.email}</div>
              )}

              {/* Server error message */}
              {this.props.errorMessage && this.props.errorMessage &&
                <div className="input-group">Oops! {this.props.errorMessage}</div>}

              <button className="btn btn-1" type="submit" disabled={isSubmitting}>
                Enter Your Account Email
              </button>

          
            </div>
          </form>
        </div>
      </div>
    );
  }
};

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required!'),
  }),
  mapPropsToValues: () => ({
    email: '',
  }),
  handleSubmit: (payload, { props, setSubmitting }) => {
    props.passwordForgotUserStep1(payload);
    setSubmitting(false);
  },
  displayName: 'PasswordForgot1',
})(PasswordForgot1);

const mapStateToProps = state => {
  return { errorMessage: state.auth.passwordForgotError }
}

const mapDispatchToProps = dispatch => {
  return {
    passwordForgotUserStep1: arr => dispatch(passwordForgotUserStep1(arr)),
  }
}

const PasswordForgot = connect(
  mapStateToProps,
  mapDispatchToProps,
)(formikEnhancer)

export default PasswordForgot;