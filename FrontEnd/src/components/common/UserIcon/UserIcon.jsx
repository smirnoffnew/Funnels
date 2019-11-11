import React, {useEffect} from 'react'
import { followOnImageError } from '../../diagram/storm/utils';
import "./UserIcon.css";

export const UserIcon = ({ style, userAvatarUrl, userName }) => {

    useEffect(()=>{
        followOnImageError("Avatar", "start")
        return () => followOnImageError("Avatar", "end")
    },[])

    return (
        <div className="user-img-preview" style={style}>
            {userAvatarUrl === "" ? <div className="user-preview-empty">
                {userName[0] && userName[0].toUpperCase()}
            </div> : <img src={'http://' + userAvatarUrl} alt="Avatar"/>}
        </div>
    )
}