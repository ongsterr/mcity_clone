import React, { useState } from 'react'
import { firebase } from '../../firebase'

import FormField from '../utils/FormField'
import { validate } from '../utils/misc'

const SignIn = props => {
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
      password: {
        element: 'input',
        value: '',
        config: {
          name: 'password_input',
          type: 'password',
          placeholder: 'Enter your password',
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: '',
      },
    },
  })

  const submitForm = event => {
    event.preventDefault()

    let dataToSubmit = {}
    let formIsValid = true

    for (let key in state.formdata) {
      dataToSubmit[key] = state.formdata[key].value
      formIsValid = state.formdata[key].valid && formIsValid
    }

    if (formIsValid) {
      firebase
        .auth()
        .signInWithEmailAndPassword(dataToSubmit.email, dataToSubmit.password)
        .then(() => {
          props.history.push('/dashboard')
        })
        .catch(err => {
          setState({
            ...state,
            formError: true,
          })
        })
    } else {
      setState({
        ...state,
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
    <div className="container">
      <div className="signin_wrapper" style={{ margin: '100px' }}>
        <form onSubmit={event => submitForm(event)}>
          <h2>Please Login</h2>
          <FormField
            id={'email'}
            formdata={state.formdata.email}
            change={element => updateForm(element)}
          />

          <FormField
            id={'password'}
            formdata={state.formdata.password}
            change={element => updateForm(element)}
          />

          {state.formError ? (
            <div className="error_label">Something is wrong, try again.</div>
          ) : null}

          <button onClick={event => submitForm(event)}>Login</button>
        </form>
      </div>
    </div>
  )
}

export default SignIn
