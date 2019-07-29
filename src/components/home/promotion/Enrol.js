import React, { useState } from 'react'
import Fade from 'react-reveal/Fade'

import FormField from '../../utils/FormField'
import { validate } from '../../utils/misc'
import { firebasePromotions } from '../../../firebase'

const Enrol = () => {
  const [state, setState] = useState({
    formError: false,
    formSuccess: '',
    formdata: {
      email: {
        element: 'input',
        value: '',
        config: {
          name: 'email_input',
          type: 'email',
          placeholder: 'Enter your email',
        },
        validation: {
          required: true,
          email: true,
        },
        valid: false,
        validationMessage: '',
      },
    },
  })

  const clearSuccessMessage = () => {
    setTimeout(() => {
      setState({ ...state, formSuccess: '' })
    }, 2000)
  }

  const resetFormSuccess = type => {
    const newFormData = {
      ...state.formdata,
    }

    for (let key in newFormData) {
      newFormData[key].value = ''
      newFormData[key].valid = false
      newFormData[key].validationMessage = ''

      setState({
        ...state,
        formError: false,
        formdata: newFormData,
        formSuccess: type
          ? 'Congrats. Email added.'
          : 'Already on the database',
      })

      clearSuccessMessage()
    }
  }

  const submitForm = event => {
    event.preventDefault()

    let dataToSubmit = {}
    let formIsValid = true

    for (let key in state.formdata) {
      dataToSubmit[key] = state.formdata[key].value
      formIsValid = state.formdata[key].valid && formIsValid
    }

    if (formIsValid) {
      firebasePromotions
        .orderByChild('email')
        .equalTo(dataToSubmit.email)
        .once('value')
        .then(snapshot => {
          if (snapshot.val() === null) {
            firebasePromotions.push(dataToSubmit)
            resetFormSuccess(true)
          } else {
            resetFormSuccess(false)
          }
        })
    } else {
      setState({
        formError: true,
      })
    }
  }

  const updateForm = element => {
    const newFormData = {
      ...state.formdata,
    }
    const newElement = { ...newFormData[element.id] }

    newElement.value = element.event.target.value

    let validData = validate(newElement)
    newElement.valid = validData[0]
    newElement.validationMessage = validData[1]

    newFormData[element.id] = newElement

    setState({
      ...state,
      formError: false,
      formdata: newFormData,
    })
  }

  return (
    <Fade>
      <div className="enroll_wrapper">
        <form action="" onSubmit={event => submitForm(event)}>
          <div className="enroll_title">Enter your email</div>
          <div className="enroll_input">
            <FormField
              id={'email'}
              formdata={state.formdata.email}
              change={element => updateForm(element)}
            />
            {state.formError ? (
              <div className="error_label">Something is wrong, try again.</div>
            ) : null}
            <div className="success_label">{state.formSuccess}</div>
            <button onClick={event => submitForm(event)}>Enrol</button>
            <div className="enroll_discl">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae
              ipsam voluptate eligendi aliquid tempora, dolore quasi ut iure
              quam nobis recusandae tenetur.
            </div>
          </div>
        </form>
      </div>
    </Fade>
  )
}

export default Enrol
