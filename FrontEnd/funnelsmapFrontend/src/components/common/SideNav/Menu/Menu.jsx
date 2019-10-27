import React from "react";
import "./Menu.css";
import MenuItem from "./MenuItem";
import MenuItemLink from "./MenuItemLink";
import { ReactComponent as ProjectSVG } from '../../../../assets/Projects.svg';
import { ReactComponent as TemplatesSVG } from '../../../../assets/Templates.svg';
import { ReactComponent as CollaborationsSVG } from '../../../../assets/Collaborations.svg';
import { ReactComponent as SettingsSVG } from '../../../../assets/Settings.svg';
import { ReactComponent as HelpdeskSVG } from '../../../../assets/Helpdesk.svg';


const Menu = () => {
  return (
    <div className='menu'>
      <MenuItem exact={true} to="/" name="Projects" icon={<ProjectSVG />} />
      <MenuItem exact={true} to="/templates" name="Templates" icon={<TemplatesSVG />} />
      <MenuItem exact={false} to="/collaborations" name="Collaborations" icon={<CollaborationsSVG />} />
      <MenuItemLink href="https://funnelsmap.com/helpdesk/" target='_blank' name="Helpdesk" icon={<HelpdeskSVG />} />
      {
        !localStorage.getItem('token2') && <MenuItem exact={false} to="/settings" name="Settings" icon={<SettingsSVG />} />
      }
      
      {/* <MenuItemUpgrade exact={false} to="/upgrade" name="Upgrade" /> */}

      {/* <MenuItem exact={false} to="/" name="Settings"> */}
        {/* <MenuItem sub exact={false} to="/settings/account-details" name="account-details" /> */}
        {/* <MenuItem sub exact={false} to="/settings/users" name="users" /> */}
      {/* </MenuItem> */}
    </div>
  );
}

export default Menu;
