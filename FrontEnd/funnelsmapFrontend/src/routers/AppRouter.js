import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom'
import { PrivateRoute } from '../components/RequireAuth';
import { PrivateRouteAddCollaborator } from '../components/PrivateRouteAddCollaborator';
import ProjectList from '../components/dashboard/projects/ProjectList';
import FunnelList from '../components/dashboard/funnels/FunnelList';
import TemplatesList from '../components/dashboard/templates/TemplateList';
import Signin from '../components/auth/Signin';
import Signup from '../components/auth/Signup';
import Questionnaire from '../components/auth/Questionnaire';
import PasswordForgot1 from '../components/auth/PasswordForgot1';
import PasswordForgot2 from '../components/auth/PasswordForgot2';
import PasswordForgot3 from '../components/auth/PasswordForgot3';
import AddCollaborators from '../components/dashboard/projects/addCollaborators/AddCollaborators';
import AddCollaboratorsImage from '../components/dashboard/projects/addCollaborators/AddCollaboratorsImage';
import Collaborations from '../components/dashboard/collaborations/Collaborations';
import SettingsAccountDetails from '../components/settings/SettingsAccountDetails/SettingsAccountDetails';
import SettingsPaymentMethods from '../components/settings/SettingsPaymentMethods/SettingsPaymentMethods';
import SettingsUsers from '../components/settings/SettingsUsers/SettingsUsers';
import Diagram from '../components/diagram/storm';
import { PrivateRouteAddPartner } from '../components/PrivateRouteAddPartner';
import AddPartner from '../components/dashboard/projects/addCollaborators/AddPartner';


const AppRouter = () => {

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {

      const scriptFacebook = document.createElement('script');
      scriptFacebook.src = "scriptFacebook.js";
      scriptFacebook.async = true;
      document.body.appendChild(scriptFacebook);

      const scriptDiffuser = document.createElement('script');
      scriptDiffuser.src = "scriptDiffuser.js";
      scriptDiffuser.async = true;
      document.body.appendChild(scriptDiffuser);

      return () => {
        document.body.removeChild(scriptFacebook);
        document.body.removeChild(scriptDiffuser);
      }
    }
  })

  return (
    <>
      {
        window.location.pathname === '/' &&
        <Redirect to={{
          pathname: '/projects'
        }} />
      }

      <Route path="/sign-in" component={Signin} />
      <Route path="/sign-up" component={Signup} />
      <Route path="/sign-up-testers" component={Signup} />

      <Route path="/password-forgot-step-1" component={PasswordForgot1} />
      <Route path="/password-forgot-step-2" component={PasswordForgot2} />
      <Route path="/password-forgot-step-3" component={PasswordForgot3} />

      <Route path="/questionnaire" component={Questionnaire} />

      <PrivateRouteAddCollaborator path="/add-collaborators/:token" component={AddCollaborators} />
      <PrivateRouteAddPartner path="/add-partner/:token" component={AddPartner} />
      <Route path="/add-collaborators-image" component={AddCollaboratorsImage} />

      <PrivateRoute exact={true} path="/projects" component={ProjectList} />
      <PrivateRoute path="/collaborations" component={Collaborations} />
      <PrivateRoute path='/funnels/:projectId' component={FunnelList} />
      <PrivateRoute path='/diagram/:funnelId' component={Diagram} />
      <PrivateRoute path='/template/:funnelId' component={Diagram} />
      <PrivateRoute path='/templates' component={TemplatesList} />

      {
        !localStorage.getItem('token2') &&
        <>
          <PrivateRoute exact={true} path="/settings" component={SettingsAccountDetails} />
          <PrivateRoute path="/settings/payment-methods" component={SettingsPaymentMethods} />
          <PrivateRoute path="/settings/users" component={SettingsUsers} />
        </>
      }


    </>
  )
};

export default AppRouter;

