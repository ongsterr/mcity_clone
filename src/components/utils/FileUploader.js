import React, { useState, useEffect } from 'react'
import FileUploader from 'react-firebase-file-uploader'

import CircularProgress from '@material-ui/core/CircularProgress'

import { firebase } from '../../firebase'

const CustomFileUploader = props => {
  const [state, setState] = useState({
    name: '',
    isUploading: false,
    fileUrl: '',
  })

  // Get derived state from props
  useEffect(() => {
    if (props.defaultImg) {
      setState({
        ...state,
        name: props.defaultImgName,
        fileUrl: props.defaultImg,
      })
    }
  }, [props.defaultImg])

  const handleUploadStart = () => {
    setState({
      ...state,
      isUploading: true,
    })
  }

  const handleUploadError = () => {
    setState({
      ...state,
      isUploading: false,
    })
  }

  const handleUploadSuccess = filename => {
    setState({
      ...state,
      name: filename,
      isUploading: false,
    })

    firebase
      .storage()
      .ref(props.dir)
      .child(filename)
      .getDownloadURL()
      .then(url => {
        setState({
          ...state,
          fileUrl: url,
        })
      })

    props.filename(filename)
  }

  const uploadAgain = () => {
    setState({
      ...state,
      name: '',
      isUploading: false,
      fileUrl: '',
    })

    props.resetImage()
  }

  return (
    <div>
      {!state.fileUrl ? (
        <div>
          <div className="label_input">{props.tag}</div>
          <FileUploader
            accept="image/*"
            name="image"
            randomizeFilename
            storageRef={firebase.storage().ref(props.dir)}
            onUploadStart={handleUploadStart}
            onUploadError={handleUploadError}
            onUploadSuccess={handleUploadSuccess}
          />
        </div>
      ) : null}

      {state.isUploading ? (
        <div
          className="progress"
          style={{ textAlign: 'center', margin: '30px 0' }}
        >
          <CircularProgress style={{ color: '#98c6e9' }} thickness={7} />
        </div>
      ) : null}
      {state.fileUrl ? (
        <div className="image_upload_container">
          <img src={state.fileUrl} alt={state.name} style={{ width: '100%' }} />
          <div className="remove" onClick={() => uploadAgain()}>
            Remove
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CustomFileUploader
