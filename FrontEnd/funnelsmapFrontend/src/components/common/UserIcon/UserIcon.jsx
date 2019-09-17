import React from 'react'
import "./UserIcon.css";
import { API_URL } from '../../../config';

export const UserIcon = ({ style, userAvatarUrl, userName }) => {
    return (
        <div className="user-img-preview" style={style}>
            {userAvatarUrl === API_URL ? <div className="user-preview-empty">
                    {userName[0] && userName[0].toUpperCase()}
                </div> :<img src={userAvatarUrl} alt="Avatar" />}
        </div>
    )
}