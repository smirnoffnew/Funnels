import React from 'react'
import "./ColoboratorsPanel.css";
import { UserIcon } from '../../UserIcon/UserIcon';

export const ColoboratorsPanel = ({ collaborators = [] }) => {
    return (
        <div className="coloborators-container">
            <div className="coloborators-text">
            Followers
            </div>
            {
                collaborators.length !== 0 && collaborators.map((user, index) => {
                    return (
                        <div className="coloborator" key={index}>
                            <UserIcon
                                userName={user.firstName ? user.firstName : "#"}
                                userAvatarUrl={`${user.photoUrl ? user.photoUrl : ""}`}
                                style={{
                                    transform: "scale(0.6)",
                                    margin: '0px',
                                    width: '50px',
                                    height: '40px'
                                }} />

                        </div>
                    )
                })
            }
        </div>
    )
}