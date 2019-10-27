import React, {useEffect} from 'react'
import "./UserIcon.css";
import API_URL from '../../../config';
import { followOnImageError } from '../../diagram/storm/utils';



export const UserIcon = ({ style, userAvatarUrl, userName }) => {


    useEffect(()=>{
        followOnImageError("Avatar", "start")
        return () => followOnImageError("Avatar", "end")
    },[])


    return (
        <div className="user-img-preview" style={style}>
            {userAvatarUrl === API_URL ? <div className="user-preview-empty">
                {userName[0] && userName[0].toUpperCase()}
            </div> : <img src={userAvatarUrl} alt="Avatar" data-avatar/>}
        </div>
    )
}