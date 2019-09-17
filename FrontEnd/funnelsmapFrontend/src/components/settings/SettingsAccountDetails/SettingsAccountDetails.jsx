import React, { Component } from 'react';
import Layout from "../../common/Layout/Layout";
import './SettingsAccountDetails.css'
import ChangeName from './ChangeUserName'
import ChangePassword from './ChangeUserPassword'
import ImageUpload from './ImageUpload'


class SettingsAccountDetails extends Component {
  render() {
    return (
      <Layout title="Account Details">
        <div id='settings-wrapper'>
          <ChangeName />
          <ImageUpload />
          <ChangePassword />
        </div>
      </Layout>
    );
  }
}

export default SettingsAccountDetails;
