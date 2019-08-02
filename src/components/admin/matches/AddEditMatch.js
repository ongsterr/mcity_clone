import React, { useState, useEffect } from 'react'

import { firebaseMatches, firebaseDB, firebaseTeams } from '../../../firebase'

import AdminLayout from '../../../hoc/AdminLayout'
import FormField from '../../utils/FormField'
import { validate, firebaseLooper } from '../../utils/misc'

const AddEditMatch = props => {
  const [state, setState] = useState({
    matchId: '',
    formType: '',
    formError: false,
    formSuccess: '',
    teams: [],
    formData: {
      date: {
        element: 'input',
        value: '',
        config: {
          label: 'Event Date',
          name: 'date_input',
          type: 'date',
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: '',
        showLabel: true,
      },
      local: {
        element: 'select',
        value: '',
        config: {
          label: 'Select Local Team',
          name: 'select_local',
          type: 'select',
          options: [],
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: '',
        showLabel: false,
      },
      away: {
        element: 'select',
        value: '',
        config: {
          label: 'Select Away Team',
          name: 'select_away',
          type: 'select',
          options: [],
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: '',
        showLabel: false,
      },
      resultLocal: {
        element: 'input',
        value: '',
        config: {
          label: 'Result Local',
          name: 'result_local_input',
          type: 'text',
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: '',
        showLabel: false,
      },
      resultAway: {
        element: 'input',
        value: '',
        config: {
          label: 'Result Away',
          name: 'result_away_input',
          type: 'text',
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: '',
        showLabel: false,
      },
      referee: {
        element: 'input',
        value: '',
        config: {
          label: 'Referee',
          name: 'referee_input',
          type: 'text',
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: '',
        showLabel: true,
      },
      stadium: {
        element: 'input',
        value: '',
        config: {
          label: 'Stadium',
          name: 'stadium_input',
          type: 'text',
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: '',
        showLabel: true,
      },
      result: {
        element: 'select',
        value: '',
        config: {
          label: 'Team Result',
          name: 'select_result',
          type: 'select',
          options: [
            { key: 'W', value: 'W' },
            { key: 'L', value: 'L' },
            { key: 'D', value: 'D' },
            { key: 'n/a', value: 'n/a' },
          ],
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: '',
        showLabel: true,
      },
      final: {
        element: 'select',
        value: '',
        config: {
          label: 'Game Played',
          name: 'select_played',
          type: 'select',
          options: [{ key: 'Yes', value: 'Yes' }, { key: 'No', value: 'No' }],
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: '',
        showLabel: true,
      },
    },
  })

  useEffect(() => {
    const matchId = props.match.params.id
    const getTeams = (match, type) => {
      firebaseTeams.once('value').then(snapshot => {
        const teams = firebaseLooper(snapshot)
        const teamOptions = teams.map(team => ({
          key: team.shortName,
          value: team.shortName,
        }))
        updateFields(match, teamOptions, teams, type, matchId)
      })
    }

    if (!matchId) {
      // Add match
      getTeams(false, 'Add Match')
    } else {
      // Fetch match
      firebaseDB
        .ref(`matches/${matchId}`)
        .once('value')
        .then(snapshot => {
          const match = snapshot.val()
          getTeams(match, 'Edit Match')
        })
    }
  }, [])

  const updateFields = (match, teamOptions, teams, type, matchId) => {
    const newFormData = {
      ...state.formData,
    }

    for (let key in newFormData) {
      if (match) {
        newFormData[key].value = match[key]
        newFormData[key].valid = true
      }
      if (key === 'local' || key === 'away') {
        newFormData[key].config.options = teamOptions
      }
    }

    setState({
      ...state,
      matchId,
      formType: type,
      formData: newFormData,
      teams,
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

    state.teams.forEach(team => {
      if (team.shortName === dataToSubmit.local) {
        dataToSubmit['localThmb'] = team.thmb
      }
      if (team.shortName === dataToSubmit.away) {
        dataToSubmit['awayThmb'] = team.thmb
      }
    })

    if (formIsValid) {
      if (state.formType === 'Edit Match') {
        firebaseDB
          .ref(`matches/${state.matchId}`)
          .update(dataToSubmit)
          .then(snapshot => {
            successForm('Updated correctly')
          })
          .catch(err => {
            setState({
              ...state,
              formError: true,
            })
          })
      } else {
        firebaseMatches
          .push(dataToSubmit)
          .then(() => {
            props.history.push('/admin_matches')
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

  const updateForm = element => {
    const newFormData = {
      ...state.formData,
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
      formData: newFormData,
    })
  }

  return (
    <AdminLayout>
      <div className="editmatch_dialog_wrapper">
        <h2>{state.formType}</h2>
        <div>
          <form onSubmit={event => submitForm(event)}>
            <FormField
              id={'date'}
              formdata={state.formData.date}
              change={element => updateForm(element)}
            />
            <div className="select_team_layout">
              <div className="label_inputs">Local</div>
              <div className="wrapper">
                <div className="left">
                  <FormField
                    id={'local'}
                    formdata={state.formData.local}
                    change={element => updateForm(element)}
                  />
                </div>
                <div>
                  <FormField
                    id={'resultLocal'}
                    formdata={state.formData.resultLocal}
                    change={element => updateForm(element)}
                  />
                </div>
              </div>
            </div>
            <div className="select_team_layout">
              <div className="label_inputs">Away</div>
              <div className="wrapper">
                <div className="left">
                  <FormField
                    id={'away'}
                    formdata={state.formData.away}
                    change={element => updateForm(element)}
                  />
                </div>
                <div>
                  <FormField
                    id={'resultAway'}
                    formdata={state.formData.resultAway}
                    change={element => updateForm(element)}
                  />
                </div>
              </div>
            </div>
            <div className="split_fields">
              <FormField
                id={'referee'}
                formdata={state.formData.referee}
                change={element => updateForm(element)}
              />
              <FormField
                id={'stadium'}
                formdata={state.formData.stadium}
                change={element => updateForm(element)}
              />
            </div>
            <div className="split_fields last">
              <FormField
                id={'result'}
                formdata={state.formData.result}
                change={element => updateForm(element)}
              />
              <FormField
                id={'final'}
                formdata={state.formData.final}
                change={element => updateForm(element)}
              />
            </div>
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

export default AddEditMatch
