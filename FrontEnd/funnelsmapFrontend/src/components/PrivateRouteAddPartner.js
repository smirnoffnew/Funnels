import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom'

export const PrivateRouteAddPartner = ({ component: ComposedComponent, ...rest }) => {

  class Authentication extends Component {
    
    // redirect if not authenticated; otherwise, return the component imputted into <PrivateRouteAddCollaborator />
    handleRender(props) {
      if (!this.props.authenticated) {
        return <Redirect to={{
          pathname: `/sign-in`,
          search: `?add-partner=${this.props.pathname}`,
          state: {
            from: props.location,
            message: 'You need to sign up'
          }
        }} />
      } else {
        return <ComposedComponent {...props} />
      }
    }

    render() {
      return (
        <Route {...rest} render={this.handleRender.bind(this)} />
      )
    }
  }

  function mapStateToProps(state) {
    return {
      authenticated: state.auth.authenticated,
      pathname: state.router.location.pathname
    };
  }

  const AuthenticationContainer = connect(mapStateToProps)(Authentication)
  return <AuthenticationContainer />
}