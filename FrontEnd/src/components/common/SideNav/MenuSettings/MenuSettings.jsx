import React from "react";
import "./MenuSettings.css";
import MenuSettingsItem from "./MenuSettingsItem"
import { ReactComponent as ArrowSVG } from '../../../../assets/arrow.svg';

const Menu = () => {
  return (
    <div className='menu-settings'>
      <MenuSettingsItem exact={true} to="/settings" name="Account Details" icon={<ArrowSVG />} />
      {/* <MenuSettingsItem exact={false} to="/settings/payment-methods" name="Payment Methods" icon={<ArrowSVG />} /> */}
      <MenuSettingsItem exact={false} to="/settings/users" name="Users" icon={<ArrowSVG />} />
    </div>
  );
}

export default Menu;
