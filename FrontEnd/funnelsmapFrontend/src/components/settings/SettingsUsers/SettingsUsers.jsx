import React, { Component } from 'react';
import Layout from "../../common/Layout/Layout";
import './SettingsUsers.css'

class SettingsUsers extends Component {

  render() {
    return (
      <Layout title="Users">
        <div className='settings-user-wrapper'>
          <div className='settings-box'>
            <label className='settings-box-label'>Permissions</label>
            <br />
            <div className='setting-input-wrapper'>
              <label className="container-checkbox">View Projects and Funnels
                <input
                  name={'1'}
                  type="checkbox"
                />
                <span className="checkmark"></span>
              </label>
              <label className="container-checkbox">Edit Projects and Funnels
                <input
                  name={'2'}
                  type="checkbox"
                />
                <span className="checkmark"></span>
              </label>
              <label className="container-checkbox">Create Projects and Funnels
                <input
                  name={'3'}
                  type="checkbox"
                />
                <span className="checkmark"></span>
              </label>
              <label className="container-checkbox">View Collaborations
                <input
                  name={'4'}
                  type="checkbox"
                />
                <span className="checkmark"></span>
              </label>
            </div>
            <button className='btn btn-1 generate-link-user-settings' type="submit">Generate Link</button>
          </div>
          <div className='settings-box'>
            <label className='settings-box-label'>Users</label>
            <br />
            <div className='setting-input-wrapper'>
              <div className='funnels-collaborators' style={{ maxHeight: '180px' }}>
                <div className='funnels-collaborators-item'>
                  <div className="empty-collaborator-photo" >V</div>
                  <p style={{ width: '212px' }} className='collaborators-in-modal'>Vladyslav Huntyk</p>
                  <button className='button-change-permission'>Change Permission</button>
                  <button className='button-remove-collaborator'>Remove</button>
                </div>
                <div className='funnels-collaborators-item'>
                  <div className="empty-collaborator-photo" >N</div>
                  <p style={{ width: '212px' }} className='collaborators-in-modal'>Nataliya Nerubenko</p>
                  <button className='button-change-permission'>Change Permission</button>
                  <button className='button-remove-collaborator'>Remove</button>
                </div>
                <div className='funnels-collaborators-item'>
                  <div className="empty-collaborator-photo" >D</div>
                  <p style={{ width: '212px' }} className='collaborators-in-modal'>Dmitro Sparta</p>
                  <button className='button-change-permission'>Change Permission</button>
                  <button className='button-remove-collaborator'>Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default SettingsUsers;

