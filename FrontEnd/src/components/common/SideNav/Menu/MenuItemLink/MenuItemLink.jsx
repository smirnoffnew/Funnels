import React from "react";
import "./MenuItemLink.css";
// import { NavLink } from "react-router-dom";

const MenuItemLink = ({ href, name, target, sub, icon, children }) => (
  <React.Fragment>
    <a
      className={["menu-item", sub && sub].join(" ")}
      href={href}
      target={target}
    >
      <div style={{ marginRight: '10px' }}>{icon}</div>
      {name}
    </a>
    {children}
  </React.Fragment>
);

MenuItemLink.defaultProps = {
  sub: false
};

export default MenuItemLink;
