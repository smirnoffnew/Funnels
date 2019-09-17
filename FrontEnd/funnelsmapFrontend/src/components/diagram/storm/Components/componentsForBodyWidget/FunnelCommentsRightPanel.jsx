import React from "react";
import ModalFunnelWidget from "../../../../common/ModalFunnelWidget";
import ClickOutside from "../../../../common/ClickOutside";
import { ReactComponent as FunnelCommentsSVG } from "../../../../../assets/FunnelComments.svg";
import { CommentPanel } from "../../../../common/Comments/CommentPannel/CommentPanel";
import { connect } from 'react-redux';
import { sendComment, getAllComment } from '../../../../../store/actions/comments'
import { UserComment } from "../../../../common/Comments/UserComment/UserComment";
import "./FunnelCommentsRightPanel.css"
import { API_URL } from "../../../../../config";
import { getNotificationTime } from "../../utils";
import {getAllFunnelsCollaboration} from "../../../../../store/actions/collaborations"
import { ColoboratorsPanel } from "../../../../common/Comments/ColoboratorsPanel/ColoboratorsPannel";



class FunnelCommentsRightPanel extends React.Component {
  state = {
    showComments: false,
    comments: ""
  };

  componentDidMount() {
    this.props.getAllComment(this.props.funnelId);
    this.props.getAllFunnelsCollaboration()
    // this.props.getAllCollaboratorsForFunnels([
    //   this.props.funnelId
    // ]  );
    
  }

  showComments = () =>
    this.setState({
      showComments: true,
      showMenu: false,
      funnelNotes:
        (this.props.work.diagram && this.props.work.diagram.funnelNotes) || []
    });

  hideComments = () => this.setState({ showNotes: false });

  sendComment = (comment) => {
    const avatarUrl = JSON.parse(localStorage.getItem("userAvatar")).replace(`${API_URL}`, '');
    this.setState({
      comments:
        [...this.state.comments,
        {
          comment,
          createdAt: new Date(),
          user_photoUrl: avatarUrl,
          user_accountName: localStorage.getItem("userFirstName"),
          user_id: localStorage.getItem("userID")

        }]
    });

    this.props.sendComment(localStorage.getItem("userID"), this.props.funnelId,
      {
        comment,
        createdAt: new Date(),
        user_photoUrl: avatarUrl,
        user_accountName: localStorage.getItem("userFirstName"),
        user_id: localStorage.getItem("userID")
      }
    )
  }

  render() {
    return (
      <>
        {this.props.work.pathname.includes("diagram") ? (
          <>
            <button
              className="diagram-header-menu-button"
              onClick={this.showComments}
              title={"Funnel Notes"}
            >
              <FunnelCommentsSVG />
            </button>
          </>
        ) : null}

        <ClickOutside
          onClickOutside={() => {
            this.setState({ showComments: false });
          }}
        >
          <ModalFunnelWidget
            show={this.state.showComments}
            handleClose={this.hideComments}
            style={{
              position: "absolute",
              top: 65,
              width: 500,
              height: '100%'
            }}
          >
            <label className="label-create-widget-settings">Comments</label>
            <div
            
              style={{
                padding: 15,
                display: "flex",
                flexDirection: "column",
                minHeight: '61vh',
                height: '75vh'
              }}
            >

              <div
                className="comments-body"
                style={{
                  height: '100%',
                  overflow: "auto",
                  color: "black",
                  overflowX: "hidden"
                }}

              >
                {this.props.comments &&
                  this.props.comments.slice().reverse().map((item, index) => {
                    const isOwner = item.user_id === localStorage.getItem("userID") ? true : false
                    return <React.Fragment key={index} >
                      <UserComment
                        comment={item.comment}
                        userName={item.user_accountName}
                        userAvatarUrl={`${API_URL}${item.user_photoUrl}`}
                        isOwner={isOwner}
                        timeCreated={getNotificationTime(item.createdAt)}
                      />
                    </React.Fragment>
                  })
                  }
              </div>
            </div>
            <CommentPanel
              sendComment={this.sendComment}
              userName={localStorage.getItem("userFirstName")}
              userAvatarUrl={JSON.parse(localStorage.getItem("userAvatar"))}
              />
              <ColoboratorsPanel />
          </ModalFunnelWidget>
        </ClickOutside>
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    funnelId: ownProps.work.match.params.funnelId,
    comments: state.comments.comments
  }
}

export default connect(mapStateToProps, { sendComment, getAllComment, getAllFunnelsCollaboration })(FunnelCommentsRightPanel)