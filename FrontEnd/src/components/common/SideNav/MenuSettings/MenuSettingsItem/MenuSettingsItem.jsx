import React from "react";
import "./MenuSettingsItem.css";
import { NavLink } from "react-router-dom";

const MenuSettingsItem = ({ to, name, exact, sub, icon, children }) => (
  <div style={{display: 'flex', justifyContent: 'space-between'}}>
    <NavLink
      exact={exact}
      className={["menu-settings-item", sub && sub].join(" ")}
      activeClassName="menu-settings-item-active"
      to={to}>
      {name}
      {icon}
    </NavLink>
    {children}
  </div>
);

MenuSettingsItem.defaultProps = {
  sub: false
};

export default MenuSettingsItem;
