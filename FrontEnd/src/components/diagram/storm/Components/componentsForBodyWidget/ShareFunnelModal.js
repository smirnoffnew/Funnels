import * as React from "react";
import { connect } from 'react-redux'
import ReactSVG from "react-svg";
import { ReactComponent as ShareFunnelSVG } from "../../../../../assets/instructions.svg";
import Modal from '../../../../common/Modal/Modal'
import { sendImageToCollaborate, resetSendImageToCollaborateLink } from "../../../../../store/actions/projects";
import RichEditor from "../../../../common/Comments/CommentPannel/CommentPanel";
import { API } from "../../../../../store/actions/instance";


import Clicks from "../../../../../assets/shareFunnel/clicks.svg";
import Views from "../../../../../assets/shareFunnel/views.svg";
import Edit from "../../../../../assets/shareFunnel/edit.svg";
import Link from "../../../../../assets/shareFunnel/link.svg";
import Share from "../../../../../assets/shareFunnel/share.svg";
import Copy from "../../../../../assets/shareFunnel/copy.svg";

import './ShareFunnelModal.css'


class ShareFunnelModal extends React.Component {

  state = {
    shareFunnel: false,
    file: '',
    tittle: '',
    text: '',
    buttonText: '',
    buttonLink: '',
    fileName: '',
    sum: {},
    showFillAllData: false,
    clearRichPanel: false,
  }

  showShareFunnel = () => this.setState({ shareFunnel: true, clearRichPanel: false }, () => {
    this.props.resetSendImageToCollaborateLink();
    API.get(`funnel/node/static/getCounter/${this.props.funnelId}`)
      .then(response => {
        const sum = this.handleGetConversionInfoForAllNodes(response.data.response)

        this.setState({
          sum
        }, () => {
          this.hideFillAllData()
          this.props.resetSendImageToCollaborateLink()
        })
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
        }
      });
  })
  hideShareFunnel = () => this.setState({
    shareFunnel: false,
    file: '',
    tittle: '',
    text: '',
    buttonText: '',
    buttonLink: '',
    fileName: '',
    sum: {},
    showFillAllData: true,

    clearRichPanel: true
  })


  showFillAllData = () => this.setState({ showFillAllData: true })
  hideFillAllData = () => this.setState({ showFillAllData: false })



  handleImageChange = e => {
    e.preventDefault()

    try {
      let reader = new FileReader();
      let file = e.target.files[0];

      this.setState({
        file: {}
      }, () => console.log('length: ', this.state.file.length))


      if (file.type.includes('image')) {
        reader.onloadend = () => {
          this.setState({
            file,
            fileName: file.name,
          }, () => {
            this.hideFillAllData()
            this.props.resetSendImageToCollaborateLink()
          });
        }
        reader.readAsDataURL(file)
      }
      else {
        this.setState({
          file: {},
          fileName: 'Select another file. It should be a picture',
        }, () => {
          this.hideFillAllData()
          this.props.resetSendImageToCollaborateLink()
        });
      }

    }
    catch (error) {
      console.log(error)
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      this.hideFillAllData()
      this.props.resetSendImageToCollaborateLink()
    });
  }

  handleUpdateText = value => {
    this.setState({ text: value }, () => {
      this.hideFillAllData()
      this.props.resetSendImageToCollaborateLink()
    })
  }

  handleGetConversionInfoForAllNodes(infoForAllNodes) {
    let counterNodeSum = 0
    let counterUrlSum = 0

    this.props.model ? JSON.parse(this.props.model).nodes.map(node => {
      infoForAllNodes.map(info => {
        if (node.id === info.nodeId) {
          if (node.extras.url === info.url) {
            if (node.extras.originalUrl === info.originalUrl) {
              counterNodeSum += info.counterNode;
              counterUrlSum += info.counterUrl;
            }
          }
        }
      })
    })
      : JSON.parse(this.props.diagram.converted).nodes.map(node => {
        infoForAllNodes.map(info => {
          if (node.id === info.nodeId) {
            if (node.extras.url === info.url) {
              if (node.extras.originalUrl === info.originalUrl) {
                counterNodeSum += info.counterNode;
                counterUrlSum += info.counterUrl;
              }
            }
          }
        })
      })

    return {
      counterNodeSum,
      counterUrlSum
    }
  }

  copyToClipboard = e => {
    this.link.select();
    document.execCommand("copy");
    e.target.focus();
  };

  clearRichPanelFalse = () => {
    this.setState({
      clearRichPanel: false
    })
  }

  render() {
    return (
      <>
        {
          this.props.work.pathname.includes('diagram') &&
            this.props.work.permissionForCollaborator.includes("Edit") ?
            <button
              className="diagram-header-instruction-button"
              onClick={this.showShareFunnel}
              title={"Share The Funnel"}
            >
              <ShareFunnelSVG />
            </button>
            :
            null
        }

        <Modal show={this.state.shareFunnel} handleClose={this.hideShareFunnel} width={666} padding={0}>

          <label
            className='main-label-share-funnel'
            style={{
              marginTop: 30
            }}
          >
            <ReactSVG
              src={Share}
              alt="Share Funnel"
              beforeInjection={svg => {
                svg.setAttribute(
                  "style",
                  `
                    margin-right: 10px;
                    width: 18px;
                    height: 18px;
                  `
                );
              }}
            />
            Share Funnel
            </label>

          <label className='second-label-share-funnel'>
            Share Funnel with Your team
            </label>

          <div className='views-and-clicks-wrapper'>

            <div className='views-wrapper'>
              <ReactSVG
                src={Views}
                alt="Views"
                beforeInjection={svg => {
                  svg.setAttribute(
                    "style",
                    `
                      margin-right: 10px;
                      width: 30px;
                      height: 36px; 
                    `
                  );
                }}
              />
              <div className='views-text-and-number-wrapper'>
                <div className='views-text'>Views:</div>
                <div className='views-number'>{this.state.sum.counterNodeSum}</div>
              </div>
            </div>

            <div className='clicks-wrapper'>
              <ReactSVG
                src={Clicks}
                alt="Clicks"
                beforeInjection={svg => {
                  svg.setAttribute("style", `margin-right: 5px;`);
                }}
              />
              <div className='clicks-text-and-number-wrapper'>
                <div className='clicks-text'>Clicks:</div>
                <div className='clicks-number'>{this.state.sum.counterUrlSum}</div>
              </div>
            </div>

          </div>

          <label className='main-label-share-funnel' style={{
            borderTop: '1px solid #C1C7CC',
            paddingTop: 20
          }}>
            <ReactSVG
              src={Edit}
              alt="Edit"
              beforeInjection={svg => {
                svg.setAttribute(
                  "style",
                  `
                    margin-right: 10px;
                    width: 15px;
                    height: 22px;
                  `
                );
              }}
            />
            Customize
          </label>

          <label className='second-label-share-funnel'>
            Customize Your Funnel
          </label>


          <div className="file-share-funnel">
            <input
              type="file"
              name="file"
              id="file"
              accept="image/x-png,image/gif,image/jpeg"
              onChange={e => this.handleImageChange(e)}
              className='share-funnel-input'
            />
            <label
              htmlFor="file"
              className="btn btn-1 btn-share-funnel-upload-logo"
            >
              Upload Logo
            </label>

            <p className='file-name'>{this.state.fileName}</p>
          </div>



          <div style={{ marginLeft: 30, marginRight: 30 }}>
            <label className='share-funnel-label'>
              Tittle
          </label>
            <input
              type="text"
              placeholder="Tittle"
              name="tittle"
              value={this.state.tittle}
              onChange={this.handleChange}
              size="30"
              maxLength="30"
              className='share-funnel-input'
            />
          </div>

          <div style={{ marginLeft: 30, marginRight: 30 }}>
            <label className='share-funnel-label'>
              Text
          </label>
            <div className="share-funnel-text-panel">
              <div className="share-funnel-text-input">
                <RichEditor
                  handleUpdateText={this.handleUpdateText}
                  clearRichPanel={this.state.clearRichPanel}
                  clearRichPanelFalse={this.clearRichPanelFalse}
                />
              </div>
            </div>
          </div>

          <div style={{ marginLeft: 30, marginRight: 30 }}>
            <div className='btn-text-and-link-wrapper'>
              <div className='btn-text-wrapper'>
                <label className='share-funnel-label'>
                  Button Text
              </label>
                <input
                  type="text"
                  placeholder="Button Text"
                  name="buttonText"
                  value={this.state.buttonText}
                  onChange={this.handleChange}
                  size="30"
                  maxLength="30"
                  className='share-funnel-input'
                />
              </div>

              <div className='btn-link-wrapper'>
                <label className='share-funnel-label'>
                  Button Link
                </label>
                <input
                  type="text"
                  placeholder="https://uk.lipsum.com/feed/html"
                  name="buttonLink"
                  value={this.state.buttonLink}
                  onChange={this.handleChange}
                  className='share-funnel-input'
                />
              </div>

            </div>
          </div>



          <div style={{
            borderTop: '1px solid #C1C7CC',
            paddingTop: 18
          }}>
            <button
              className={
                `btn btn-1 btn-share-funnel-save 
                ${
                !!this.props.link === true && 'btn-share-funnel-save-disabled'
                } 
                `
              }
              disabled={
                !!this.props.link === true
              }
              onClick={() => {
                this.state.file.length !== 0 &&
                  this.state.tittle.length !== 0 &&
                  this.state.text.length !== 0 &&
                  this.state.buttonText.length !== 0 &&
                  this.state.buttonLink.length !== 0 ?

                  this.props.sendImageToCollaborate(
                    this.props.funnelId,
                    this.state
                  )
                  : this.showFillAllData()
              }}
            >
              Save
            </button>
          </div>

          {this.state.showFillAllData &&
            <div
              className='input-group'
              style={{
                margin: '0px auto 15px'
              }}
            >fill in all data</div>
          }

          {this.props.sendImageToCollaborateMessage &&
            <div
              className='input-group'
              style={{
                margin: '0px auto 5px'
              }}
            >{this.props.sendImageToCollaborateMessage}</div>
          }



          {this.props.link ?
            <div style={{ marginLeft: 30, marginRight: 30, marginBottom: 20 }}>
              <div className='share-funnel-created-link-wrapper'>

                <ReactSVG
                  src={Link}
                  alt="Link"
                  beforeInjection={svg => {
                    svg.setAttribute(
                      "style",
                      `
                    width: 15px;
                    height: 15px;
                    position: absolute;
                    top: 12px;
                    left: 20px;
                  `
                    );
                  }}
                />

                <input
                  className="share-funnel-created-link share-funnel-input-link"
                  style={{
                    margin: 0,
                    padding: 10,
                  }}
                  ref={ref => this.link = ref}
                  value={this.props.link}
                  onChange={() => { }}
                />
                <button
                  className="btn btn-1 btn-share-funnel-copy-link"
                  onClick={this.copyToClipboard}
                >
                  <ReactSVG
                    src={Copy}
                    alt="Copy Link"
                    beforeInjection={svg => {
                      svg.setAttribute(
                        "style",
                        `
                          width: 14px;
                          height: 14px; 
                        `
                      );
                    }}
                  />
                </button>
              </div>
            </div>
            : null}
        </Modal >

      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    diagram: state.projects[`diagram${ownProps.work.match.params.funnelId}`],
    model: state.history.present[`model${ownProps.work.match.params.funnelId}`],
    funnelId: ownProps.work.match.params.funnelId,
    link: state.projects.sendImageToCollaborateLink,
    sendImageToCollaborateMessage: state.projects.sendImageToCollaborateMessage,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sendImageToCollaborate: (funnelId, info) => dispatch(sendImageToCollaborate(funnelId, info)),
    resetSendImageToCollaborateLink: () => dispatch(resetSendImageToCollaborateLink()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareFunnelModal)