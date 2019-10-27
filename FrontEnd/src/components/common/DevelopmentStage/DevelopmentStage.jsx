import React from 'react'
import "./DevelopmentStage.css";

export const DevelopmentStage = ({ status }) => {
    return (
        <div>
            {status === "UNDER DEVELOPMENT" ?
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" >
                    <g id="Group_87" data-name="Group 87" transform="translate(-691 -227)">
                        <g id="иконка" transform="translate(559.5 1475.5) rotate(-90)" >
                            <circle id="Ellipse_79" data-name="Ellipse 79" cx="11" cy="11" r="10" transform="translate(1248.5 131.5) rotate(90)" fill="#636e84" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                            <path id="Path_1191" data-name="Path 1191" d="M1240.516,142.112l-2.605,3.518-1.112,1.5-.638.861-4.355-5.881Z" transform="translate(1.484 -1.487)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </g>
                    </g>
                </svg>
                : (status === "FINISHED" ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
                        <g id="Group_88" data-name="Group 88" transform="translate(-658 -115)">
                            <g id="иконка" transform="translate(526.5 1363.5) rotate(-90)">
                                <circle id="Ellipse_79" data-name="Ellipse 79" cx="11" cy="11" r="10" transform="translate(1248.5 131.5) rotate(90)" fill="#fd8f21" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                                <path id="Path_1189" data-name="Path 1189" d="M0,2.311,3.552,5.862,9.414,0" transform="translate(1240.057 137.993) rotate(90)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </g>
                        </g>
                    </svg>
                    : "")
            }
        </div>
    )
}