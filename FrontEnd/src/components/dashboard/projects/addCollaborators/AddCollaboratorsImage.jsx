import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { addCollaborator } from '../../../../store/actions/collaborations'
import logo from '../../../../assets/Logo_invert.png'
import { ReactComponent as CollaborateSVG } from '../../../../assets/collaborate.svg';
import BodyWidget from "../../../diagram/storm/Components/BodyWidget";
import Application from "../../../diagram/storm/Application";
import {
  getDiagramForRecipiensCollaborator,
  getSVGForRecipiensCollaborator,
  showAnalyticsBoolean,
  setPermission,
  getConversationInfoWithPromisefication,

  getConversionInfoForAllNodesForRecipiensCollaborator,
  changeKeyDown,
} from '../../../../store/actions/projects'
import { hideConversionLink } from "../../../../store/actions/conversion";
import { updateModel } from "../../../../store/actions/undo";

import axios from 'axios'
import API_URL from '../../../../config'

import "storm-react-diagrams/dist/style.min.css";
import './AddCollaboratorsImage.css'
import "../../../diagram/storm/index.css";

class AddCollaboratorsImage extends React.Component {

  state = {
    navigate: false,
    referrer: null,
    snackMsg: 'prev',
  };

  componentDidMount = () => {
    let params = new URLSearchParams(window.location.search);

    const axiosConfig = {
      headers: {
        'Authorization': params.get('add-collaborators-image')
      },
    };

    axios.post(`${API_URL}/funnel/get-signin-token`, {}, axiosConfig)
      .then(response => {

        this.props.getDiagramForRecipiensCollaborator(params.get('funnelId'), "Bearer " + response.data.message);
        this.props.getSVGForRecipiensCollaborator("Bearer " + response.data.message);

        this.setState({
          token: "Bearer " + response.data.message,
          logo: response.data.info.logo,
          tittle: response.data.info.title,
          text: response.data.info.text,
          buttonText: response.data.info.buttonText,
          buttonLink: response.data.info.buttonLink,
        })
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data.error)
        }
      });

    this.props.setPermission('View');
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.diagram)
      if (
        nextProps.diagram.snackMsg !== prevState.snackMsg
      )
        return {
          diagram: nextProps.model ? nextProps.model : nextProps.diagram.converted,
          snackMsg: 'next',
        };
      else
        return {
          diagram: nextProps.model ? nextProps.model : nextProps.diagram.converted,
          snackMsg: 'prev',
        };
    else return null
  }

  redirectToAddCollaborators = () => {
    let params = new URLSearchParams(window.location.search);
    this.setState({ referrer: `/add-collaborators/${params.get('add-collaborators-image')}` });
  }

  render() {
    const app = new Application(
      this.state.diagram,
      this.props.svg,
    );

    const { referrer } = this.state;
    if (referrer) return <Redirect to={referrer} />;

    return (
      <div className='add-collaborators-img-body'>

        <BodyWidget app={app} work={this.props} addCollaborators tokenCollaborator={this.state.token} />

        <div className='add-collaborators-img-right-panel-wrapper'>
          <div className='add-collaborators-img-right-panel'>
            <img className='add-collaborators-img-logo' src={'http://' + this.state.logo} alt='logo' />

            <p className='add-collaborators-img-text-first'>{this.state.tittle}</p>

            <div
              className='add-collaborators-img-text-second'
              dangerouslySetInnerHTML={{ __html: this.state.text }}>
            </div>


            <div className='btn-add-collaborators-text-wrapper' >
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={this.state.buttonLink}
                className="btn btn-1 btn-add-collaborators-text"
              >
                {this.state.buttonText}
              </a>
            </div>

          </div>
        </div>

      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  let params = new URLSearchParams(window.location.search);

  return {
    router: state.router,
    tokenCollaborator: ownProps.match.params.token,
    error: state.collaborations.addCollaboratorError,
    diagram: state.projects[`diagram${params.get('funnelId')}`],
    model: state.history.present[`model${params.get('funnelId')}`],
    svg: state.projects.svgList,
    funnelId: params.get('funnelId'),
    message: state.projects.saveDiagramMessage,
    createTemplateMessage: state.projects.createTemplateMessage,
    link: state.projects.sendImageToCollaborateLink,
    pathname: state.router.location.pathname,
    changeFunnelNameMessage: state.projects.changeFunnelNameMessage,
    showSettingsWidgetBoolean: state.projects.showSettingsWidgetBoolean,
    showSettingsWidgetModel: state.projects.showSettingsWidgetModel,
    showSettingsWidgetEngine: state.projects.showSettingsWidgetEngine,
    showNotesWidgetBoolean: state.projects.showNotesWidgetBoolean,
    showNotesWidgetModel: state.projects.showNotesWidgetModel,
    showNotesWidgetEngine: state.projects.showNotesWidgetEngine,
    showTypeOfNode: state.projects.showTypeOfNode,
    UTMLinkMessage: state.projects.createUTMLinkMessage,
    permissionForCollaborator: state.projects.permissionForCollaborator,
    ownersList: state.users.ownersList,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch: item => dispatch(item),
    addCollaborator: id => dispatch(addCollaborator(id)),
    updateModel: (model, funnelId) => dispatch(updateModel(model, funnelId)),

    getSVGForRecipiensCollaborator: (token) => dispatch(getSVGForRecipiensCollaborator(token)),
    getDiagramForRecipiensCollaborator: (funnelId, token) => dispatch(getDiagramForRecipiensCollaborator(funnelId, token)),
    getConversionInfoForAllNodesForRecipiensCollaborator: (funnelId, token) => dispatch(getConversionInfoForAllNodesForRecipiensCollaborator(funnelId, token)),

    showAnalyticsBoolean: boolean => dispatch(showAnalyticsBoolean(boolean)),
    changeKeyDown: key => dispatch(changeKeyDown(key)),
    setPermission: item1 => dispatch(setPermission(item1)),
    hideConversionLink: boolean => dispatch(hideConversionLink(boolean)),
    getConversationInfoWithPromisefication: (item1, item2) => dispatch(getConversationInfoWithPromisefication(item1, item2)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCollaboratorsImage);
