import React, { Component } from 'react';
import Layout from "../../common/Layout/Layout";
import './SettingsPaymentMethods.css'

class SettingsPaymentMethods extends Component {

  render() {
    return (
      <Layout title="Payment Methods">
        <div className='settings-payment-wrapper'>
          <div className='settings-box'>
            <label className='settings-box-label'>Credit card for Personal`s team</label>
            <br />
            <div className='setting-input-wrapper'>
              <label className='settings-label-input'>
                Credit Card
              </label>
              <br />
              <input
                autoComplete="off"
                id='name'
                className='input-payment-card-top'
                placeholder="**** **** **** 3496"
                type="text"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                <input
                  autoComplete="off"
                  id='name'
                  className='input-payment-calendar'
                  placeholder="01 /2024"
                  type="text"
                  style={{ width: '200px' }}
                />

                <input
                  autoComplete="off"
                  id='name'
                  className='input-payment-card'
                  placeholder="***"
                  type="text"
                  style={{ width: '200px' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', width: '333px', margin: 'auto' }}>
              <button className='btn btn-1 generate-link-user-settings' type="submit">Change</button>
              <button
                className='btn btn-1 generate-link-user-settings'
                type="submit"
                style={{
                  border: '1px #848f99 solid',
                  background: 'white',
                  color: '#848f99'
                }}
              >Remove</button>
            </div>
          </div>

          <div className='settings-box'>
            <label className='settings-box-label'>Subscription</label>
            <br />
            <div className='setting-input-wrapper'>
              <p className='text-settings-payment'><span style={{ color: '#fd8f21' }}>✓</span> Fro Plan</p>
              <p className='text-settings-payment'><span style={{ color: '#fd8f21' }}>✓</span> Next bill on 6 June 2019</p>
              <p className='text-settings-payment'><span style={{ color: '#fd8f21' }}>✓</span> 9.95 USD/Month Total</p>
              <br />
              <button className='btn btn-1 subscription-payment-settings' style={{ width: '170px' }} type="submit">Cancel Subscription</button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default SettingsPaymentMethods;

