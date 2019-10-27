import React from "react";
import ModalFunnelWidget from "../../../../common/ModalFunnelWidget";
import ClickOutside from "../../../../common/ClickOutside";
import { ReactComponent as FunnelCommentsSVG } from "../../../../../assets/FunnelComments.svg";
import { CommentPanel } from "../../../../common/Comments/CommentPannel/CommentPanel";
import { connect } from 'react-redux';
import { sendComment, getAllComment } from '../../../../../store/actions/comments'
import { UserComment } from "../../../../common/Comments/UserComment/UserComment";
import "./FunnelCommentsRightPanel.css"
import API_URL from "../../../../../config";
import { getNotificationTime } from "../../utils";
import { getAllCollaborators } from "../../../../../store/actions/collaborations"
import { ColoboratorsPanel } from "../../../../common/Comments/ColoboratorsPanel/ColoboratorsPannel";
import domtoimage from "dom-to-image";
import randomString from "random-string";

class FunnelCommentsRightPanel extends React.Component {
  state = {
    showComments: false,
    comments: "",
    isVisibleLastElement: true
  };

  componentDidMount() {
    this.props.getAllComment(this.props.funnelId);
    this.props.getAllCollaborators(this.props.funnelId)
  }

  componentDidUpdate(prevProps) {
    this.autoScrollToDown()
    if (!prevProps.work.showCommentsWidgetBoolean && this.props.work.showCommentsWidgetBoolean) {
      this.props.getAllComment(this.props.funnelId)
      this.props.getAllCollaborators(this.props.funnelId)
    }

  }



  autoScrollToDown(bool) {
    const hiddenElement = document.getElementById("box");
    // if(this.state.isVisibleLastElement||bool){
    hiddenElement.scrollIntoView({ block: "center", inline: "nearest" });
    // }   
  }

  showComments = () => {
 
    let diagram = document.getElementById("diagram-layer");
    domtoimage
      .toBlob(diagram)
      .then(data => {
        let name = randomString({ length: 10 });
        var file = new File([data], name, { type: "image/svg" });
        this.setState(
          {
            snackMsg: "next",
            converted: this.props.app.serialization(
              this.props.app.getDiagramEngine().getDiagramModel()
            )
          },
          () => {
            this.props.work.saveDiagram(this.props.work.funnelId, this.state, file);
          })
      }).then(() =>{
        this.setState({
          showComments: true,
        }); 
        this.props.work.showCommentsBoolean(true) 
      }   )

      
  }

  hideComments = () => {
    this.setState({
      showComments: false
    })
    this.props.work.showCommentsBoolean(false)
  };

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
              style={{
                marginLeft: "16px"
              }}
            >
              <FunnelCommentsSVG />
            </button>
          </>
        ) : null}

        <ClickOutside
          onClickOutside={this.hideComments}
        >
          <ModalFunnelWidget
            show={this.state.showComments}
            handleClose={this.hideComments}
            style={{
              position: "absolute",
              top: 65,
              width: 500,
              height: "calc(100vh -67px)"
            }}
          >
            <label className="label-create-widget-settings">Comments</label>
            <div

              style={{
                padding: 15,
                display: "flex",
                flexDirection: "column",
                // minHeight: '61vh',
                // height: '75vh',
                height: '75%'

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
                  this.props.comments.slice().map((item, index) => {
                    const isOwner = item.user_id === localStorage.getItem("userID") ? true : false

                    return <React.Fragment key={index} >
                      {
                        // (index + 1) === this.props.comments.length ?
                        // <VisibilitySensor onChange={(isVisible) => {this.setState({isVisibleLastElement: isVisible})}}>
                        <UserComment
                          comment={item.comment}
                          userName={item.user_accountName}
                          userAvatarUrl={`${API_URL}${item.user_photoUrl}`}
                          isOwner={isOwner}
                          timeCreated={getNotificationTime(item.createdAt)}
                        />
                        // </VisibilitySensor>
                        // :

                        // <UserComment
                        // comment={item.comment}
                        // userName={item.user_accountName}
                        // userAvatarUrl={`${API_URL}${item.user_photoUrl}`}
                        // isOwner={isOwner}
                        // timeCreated={getNotificationTime(item.createdAt)}
                        // />

                      }


                    </React.Fragment>
                  })
                }

                <div id={"box"}> </div>

              </div>
            </div>
            <CommentPanel
              sendComment={this.sendComment}
              userName={localStorage.getItem("userFirstName")}
              userAvatarUrl={JSON.parse(localStorage.getItem("userAvatar"))}
            />
            <ColoboratorsPanel collaborators={this.props.collaboratorsInfo} />
          </ModalFunnelWidget>
        </ClickOutside>
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    funnelId: ownProps.work.match.params.funnelId,
    comments: state.comments.comments,
    collaboratorsInfo: state.collaborations.collaboratorsInfo
  }
}

export default connect(mapStateToProps, { sendComment, getAllComment, getAllCollaborators })(FunnelCommentsRightPanel)