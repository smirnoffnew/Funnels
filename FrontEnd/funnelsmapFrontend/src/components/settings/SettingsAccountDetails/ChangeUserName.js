import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { changeUserName } from '../../../store/actions/settings'

class ChangeUserName extends React.Component {
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
      <form onSubmit={handleSubmit}>
        <div className='settings-box'>
          <label className='settings-box-label'>Your Account Details</label>
          <br />

          <div className='setting-input-wrapper'>
            <label className='settings-label-input'>
              Name
            </label>
            <br />
            <input
              id='name'
              placeholder="Change Your Name"
              type="text"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && touched.name && (
              <div className={`input-group ${errors.name && touched.name ? 'has-error' : ''}`}>{errors.name}</div>
            )}

            <label htmlFor="email" className='label' style={{ height: '24px' }}>
              Email address
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
            {this.props.changeUserNameMessage && this.props.changeUserNameMessage.length > 0 && (
              <div className={`input-group`}>{this.props.changeUserNameMessage}</div>
            )}


          </div>


          <button className='btn btn-1' type="submit"
            style={{
              width: '120px',
              margin: 'auto',
              display: 'block',
              marginBottom: '20px'
            }}
          >Save</button>
        </div>
      </form>
    );
  }
};

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .min(2, 'Minimum 2 letters')
      .max(25, 'Maximum 25 letters'),
    email: Yup.string().email('Invalid email address')
  }),
  mapPropsToValues: () => ({
    name: localStorage.getItem('userFirstName'),
    email: '',
  }),
  handleSubmit: (payload, { props, setSubmitting }) => {
    props.changeUserName(payload);
    setSubmitting(false);
  },
  displayName: 'ChangeUserName',
})(ChangeUserName);

const mapStateToProps = state => {
  return {
    changeUserNameMessage: state.settings.settingsMessageName,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeUserName: name => dispatch(changeUserName(name))
  }
}

const ChangeName = connect(
  mapStateToProps,
  mapDispatchToProps,
)(formikEnhancer)

export default ChangeName;