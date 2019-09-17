import React from 'react'
import "./ColoboratorsPanel.css";
import { UserIcon } from '../../UserIcon/UserIcon';
import { API_URL } from '../../../../config';

export const ColoboratorsPanel = ({coloborators = [{userName:'Ivan'},{userName:'Ivan'},{userName:'Ivan'},{userName:'Ivan'},{userName:'Ivan'},{userName:'Ivan'},{userName:'Ivan'},{userName:'Ivan'},{userName:'Ivan'},{userName:'Ivan'}]}) => {
    return (
        <div className="coloborators-container">
            <div className="coloborators-text">
            Coloborators:
</div>
            {
                coloborators.map((user, index) => {
                    return (
                        <div className="coloborator" key = {index}>
                            
                            <UserIcon userName={user.userName}  
                            userAvatarUrl={`${API_URL}${user.user_photoUrl?user.user_photoUrl:""}`} 
                            style={{ transform: "scale(0.6)",
                            margin:'0px',
                            width: '50px',
                            height: '40px'
                            }}/>

                        </div>
                    )
                })
            }
        </div>
    )
}