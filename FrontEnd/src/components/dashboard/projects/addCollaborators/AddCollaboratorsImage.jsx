import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { addCollaborator } from '../../../../store/actions/collaborations'
import logo from '../../../../assets/Logo_invert.png'
import { ReactComponent as CollaborateSVG } from '../../../../assets/collaborate.svg';
import './AddCollaboratorsImage.css'

class AddCollaboratorsImage extends React.Component {
  state = {
    navigate: false,
    referrer: null,
  };

  redirectToAddCollaborators = () => {
    let params = new URLSearchParams(this.props.router.location.search);
    this.setState({ referrer: `/add-collaborators/${params.get('add-collaborators-image')}` });
  }

  render() {
    let params = new URLSearchParams(this.props.router.location.search);


    const { referrer } = this.state;
    if (referrer) return <Redirect to={referrer} />;

    return (
      <div className='add-collaborators-img-body'>

        <img className='add-collaborators-img-image' src={'http://' + params.get('image')} alt='img' />

        <div className='add-collaborators-img-right-panel-wrapper'>
          <div className='add-collaborators-img-right-panel'>
            <img className='signin-logo' src={logo} alt='logo' />
            <p className='add-collaborators-img-text-first'>The Following Funnel Has <br /> Been Shared with You</p>
            <CollaborateSVG />
            <p className='add-collaborators-img-text-second'>Click below to add to this funnel to <br /> your dashboard</p>
            <button className="btn btn-1" onClick={() => this.redirectToAddCollaborators()}>Add to My Dashboard</button>
          </div>
        </div>

        {/* {
          this.props.error && this.props.error.length > 0 ?
            <p className='create-funnels'>{this.props.error}</p> : null
        } */}
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  // console.log('ownProps: ', ownProps.location.search.image)
  return {
    router: state.router,
    tokenCollaborator: ownProps.match.params.token,
    error: state.collaborations.addCollaboratorError,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    addCollaborator: id => dispatch(addCollaborator(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCollaboratorsImage);