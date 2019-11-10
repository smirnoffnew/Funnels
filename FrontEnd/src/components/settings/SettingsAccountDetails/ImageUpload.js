import React from 'react';
import { connect } from 'react-redux';
import './ImageUpload.css'
import { changeUserAvatar } from '../../../store/actions/settings'

class ImageUpload extends React.Component {

  state = {
    file: '',
    imagePreviewUrl: ''
  };

  handleImageChange = e => {
    e.preventDefault()

    try {
      let reader = new FileReader();
      let file = e.target.files[0];
      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result
        },
          () => {
            this.props.changeUserAvatar(this.state.file)
          }
        );
      }
      reader.readAsDataURL(file)
    }
    catch (error) {
      console.log(error)
    }
  }

  render() {
    const userAvatar = JSON.parse(localStorage.getItem('userAvatar'));

    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} alt='Avatar' />);
    } else {
      $imagePreview = (userAvatar === '' ? <div className="preview-text">Please select an Image</div> : <img src={'http://' + userAvatar} alt='Avatar' />);
    }

    return (
      <>
        <div className="settings-box-form">
          <div className='settings-box'>
            <label className='settings-box-label'>Your Avatar</label>
            <br />
            <div className="img-preview">
              {$imagePreview}
            </div>


            {this.props.changeUserAvatarMessage && this.props.changeUserAvatarMessage.length > 0 && (
              <div className={`input-group`} style={{ textAlign: 'center' }}>{this.props.changeUserAvatarMessage}</div>
            )}

            <p className="file">
              <input
                type="file"
                name="file"
                id="file"
                accept="image/x-png,image/gif,image/jpeg"
                onChange={e => this.handleImageChange(e)}
              />
              <label
                htmlFor="file"
                className="btn btn-1"
                style={{
                  width: '150px',
                  marginBottom: '20px'
                }}
              >
                Choose Image
            </label>
            </p>

          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    changeUserAvatarMessage: state.settings.settingsMessageAvatar,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeUserAvatar: data => dispatch(changeUserAvatar(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageUpload)