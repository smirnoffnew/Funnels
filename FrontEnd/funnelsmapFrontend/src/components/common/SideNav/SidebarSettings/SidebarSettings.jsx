import React from "react";
import "./SidebarSettings.css";
import MenuSettings from "../MenuSettings";

const SidebarSettings = () => {
  return (
    <aside className='sidebar-settings'>
      <p style={{ color: 'white' }}>Account</p>
      <MenuSettings />
    </aside>
  );
}

export default SidebarSettings;
