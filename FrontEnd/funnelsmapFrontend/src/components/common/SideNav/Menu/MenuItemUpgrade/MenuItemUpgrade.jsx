import React from "react";
import "./MenuItemUpgrade.css";
import { NavLink } from "react-router-dom";

const MenuItemUpgrade = ({ to, name, exact, sub, children }) => (
  <React.Fragment>
    <NavLink
      exact={exact}
      className={["menu-item-upgrade", sub && sub].join(" ")}
      activeClassName="menu-item-active-upgrade"
      to={to}>
      {name}
    </NavLink>
    {children}
  </React.Fragment>
);

MenuItemUpgrade.defaultProps = {
  sub: false
};

export default MenuItemUpgrade;
