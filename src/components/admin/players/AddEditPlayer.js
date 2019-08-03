import React, { useState, useEffect } from 'react'

import { firebasePlayers, firebaseDB, firebase } from '../../../firebase'

import AdminLayout from '../../../hoc/AdminLayout'
import FormField from '../../utils/FormField'
import { validate } from '../../utils/misc'
import FileUploader from '../../utils/FileUploader'

const AddEditPlayer = props => {
  const [state, setState] = useState({
    playerId: '',
    formType: '',
    formError: false,
    formSuccess: '',
    defaultImg: '',
    formData: {
      name: {
        element: 'input',
        value: '',
        config: {
          label: 'Player Name',
          name: 'name_input',
          type: 'text',
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: '',
        showLabel: true,
      },
      lastname: {
        element: 'input',
        value: '',
        config: {
          label: 'Player Last Name',
          name: 'last_name_input',
          type: 'text',
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: '',
        showLabel: true,
      },
      number: {
        element: 'input',
        value: '',
        config: {
          label: 'Player Number',
          name: 'number_input',
          type: 'text',
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: '',
        showLabel: true,
      },
      position: {
        element: 'select',
        value: '',
        config: {
          label: 'Select a position',
          name: 'select_position',
          type: 'select',
          options: [
            { key: 'Keeper', value: 'Keeper' },
            { key: 'Defence', value: 'Defence' },
            { key: 'Midfield', value: 'Midfield' },
            { key: 'Forward', value: 'Forward' },
          ],
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: '',
        showLabel: true,
      },
      image: {
        element: 'image',
        value: '',
        validation: {
          required: true,
        },
        valid: true,
      },
    },
  })

  useEffect(() => {
    const playerId = props.match.params.id

    if (!playerId) {
      setState({
        ...state,
        formType: 'Add Player',
      })
    } else {
      firebaseDB
        .ref(`players/${playerId}`)
        .once('value')
        .then(snapshot => {
          const playerData = snapshot.val()
          firebase
            .storage()
            .ref('players')
            .child(playerData.image)
            .getDownloadURL()
            .then(url => {
              updateFields(playerData, playerId, 'Edit Player', url)
            })
            .catch(err => {
              updateFields(
                { ...playerData, image: '' },
                playerId,
                'Edit Player',
                ''
              )
            })
        })
    }
  }, [])

  const updateFields = (player, playerId, formType, defaultImg) => {
    const newFormData = { ...state.formData }

    for (let key in newFormData) {
      newFormData[key].value = player[key]
      newFormData[key].valid = true
    }

    setState({
      ...state,
      playerId,
      defaultImg,
      formType,
      formData: newFormData,
    })
  }

  const successForm = message => {
    setState({
      ...state,
      formSuccess: message,
    })

    setTimeout(() => {
      setState({
        ...state,
        formSuccess: '',
      })
    }, 2000)
  }

  const submitForm = event => {
    event.preventDefault()

    let dataToSubmit = {}
    let formIsValid = true

    for (let key in state.formData) {
      dataToSubmit[key] = state.formData[key].value
      formIsValid = state.formData[key].valid && formIsValid
    }

    if (formIsValid) {
      if (state.formType === 'Edit Player') {
        firebaseDB
          .ref(`players/${state.playerId}`)
          .update(dataToSubmit)
          .then(() => {
            successForm('Update correctly')
          })
          .catch(err => setState({ ...state, formError: true }))
      } else {
        firebasePlayers
          .push(dataToSubmit)
          .then(() => {
            props.history.push('/admin_players')
          })
          .catch(err => {
            setState({
              ...state,
              formError: true,
            })
          })
      }
    } else {
      setState({
        ...state,
        formError: true,
      })
    }
  }

  const updateForm = (element, content = '') => {
    const newFormData = {
      ...state.formData,
    }
    const newElement = { ...newFormData[element.id] }

    if (content === '') {
      newElement.value = element.event.target.value
    } else {
      newElement.value = content
    }

    let validData = validate(newElement)
    newElement.valid = validData[0]
    newElement.validationMessage = validData[1]

    newFormData[element.id] = newElement

    setState({
      ...state,
      formError: false,
      formData: newFormData,
    })
  }

  const resetImage = () => {
    const newFormData = { ...state.formData }
    newFormData['image'].value = ''
    newFormData['image'].valid = false
    setState({
      ...state,
      defaultImg: '',
      formData: newFormData,
    })
  }

  const storeFilename = filename => {
    updateForm(
      {
        id: 'image',
      },
      filename
    )
  }

  return (
    <AdminLayout>
      <div className="editplayers_dialog_wrapper">
        <h2>{state.formType}</h2>
        <div>
          <FileUploader
            dir="players"
            tag={'Player Image'}
            defaultImg={state.defaultImg}
            defaultImgName={state.formData.image.value}
            resetImage={() => resetImage()}
            filename={file => storeFilename(file)}
          />
          <form onSubmit={event => submitForm(event)}>
            <FormField
              id={'name'}
              formdata={state.formData.name}
              change={element => updateForm(element)}
            />
            <FormField
              id={'lastname'}
              formdata={state.formData.lastname}
              change={element => updateForm(element)}
            />
            <FormField
              id={'number'}
              formdata={state.formData.number}
              change={element => updateForm(element)}
            />
            <FormField
              id={'position'}
              formdata={state.formData.position}
              change={element => updateForm(element)}
            />
            <div className="success_label">{state.formSuccess}</div>
            {state.formError ? (
              <div className="error_label">Something</div>
            ) : (
              ''
            )}
            <div className="admin_submit">
              <button onClick={event => submitForm(event)}>
                {state.formType}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AddEditPlayer
