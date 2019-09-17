import React from "react";
import "./MenuItem.css";
import { NavLink } from "react-router-dom";

const MenuItem = ({ to, name, exact, sub, icon, children }) => (
  <React.Fragment>
    <NavLink
      exact={exact}
      className={["menu-item", sub && sub].join(" ")}
      activeClassName="menu-item-active"
      to={to}>
      <div style={{marginRight: '10px'}}>{icon}</div>
      {name}
    </NavLink>
    {children}
  </React.Fragment>
);

MenuItem.defaultProps = {
  sub: false
};

export default MenuItem;
