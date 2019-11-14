import React from 'react';
import MenuItem from "../components/common/SideNav/Menu/MenuItem";
import { ReactComponent as ProjectSVG } from '../assets/Projects.svg';
import './NoFound.css'

const NotFound = () => (
  <div className="create-funnels">
    <div className='gg'>404!</div>
    <br /> 
    <div className='page-not-found'>Page Not Found</div>
    <div style={{ background: '#212939' }}>
      <MenuItem exact={true} to="/projects" name="Go Back To Projects" icon={<ProjectSVG />} />
    </div>
  </div>
);

export default NotFound;



