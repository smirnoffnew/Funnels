import React from 'react'
import "./UserComment.css";
import { UserIcon } from '../../UserIcon/UserIcon';

export const UserComment = ({ userName, comment, isOwner = true, userAvatarUrl, timeCreated }) => {
    return (
        <div className="user-comment">
            <div className="user-comment-user-info-block" style={{ flexDirection: `${isOwner ? "row-reverse" : " "}`, marginRight: `${isOwner ? "10px" : " "}` }}>
                <UserIcon style={{ justifyContent: "left", margin: 0, transform: "scale(0.8)" }} userAvatarUrl={userAvatarUrl} userName={userName} />
                <div className="user-comment-user-name">{userName}</div>
                <div className="user-component-time-created" style = {{marginLeft:`${!isOwner? '13%': " "}`,marginRight:`${isOwner?'13%':" "}` }}>{timeCreated}</div>
            </div>
            <div className="user-comment-block">
                <div className="user-comment-text-arrow" style={{ marginLeft: `${isOwner ? "84%" : "10%"}`, transform: `${isOwner ? "scale(-1, 1)" : " "}` }}></div>
                <div className="user-comment-text-block" style={{ marginLeft: `${isOwner ? "auto" : "10px"}`, marginRight: `${isOwner ?  "20px" : " "}` }}>
                        <div dangerouslySetInnerHTML={{ __html: comment&&`${comment}`}}>
                        </div>
                </div>
            </div>
        </div>
    )
}