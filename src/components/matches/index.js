import React, { useState, useEffect } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'

import { firebaseMatches } from '../../firebase'
import { firebaseLooper, reverseArray } from '../utils/misc'
import LeagueTable from './Table'
import MatchesList from './MatchesList'

const Matches = () => {
  const [state, setState] = useState({
    loading: true,
    matches: [],
    filterMatches: [],
    playedFilter: 'All',
    resultFilter: 'All',
  })

  useEffect(() => {
    firebaseMatches.once('value').then(snapshot => {
      const matches = firebaseLooper(snapshot)
      setState({
        ...state,
        loading: false,
        matches: reverseArray(matches),
        filterMatches: reverseArray(matches),
      })
    })
  }, [])

  const showPlayed = played => {
    const list = state.matches.filter(match => {
      return match.final === played
    })

    setState({
      ...state,
      filterMatches: played === 'All' ? state.matches : list,
      playedFilter: played,
      resultFilter: 'All',
    })
  }

  const showResult = result => {
    const list = state.matches.filter(match => {
      return match.result === result
    })

    setState({
      ...state,
      filterMatches: result === 'All' ? state.matches : list,
      playedFilter: 'All',
      resultFilter: result,
    })
  }

  return (
    <div className="the_matches_container">
      <div className="the_matches_wrapper">
        <div className="left">
          <div className="match_filters">
            <div className="match_filters_box">
              <div className="tag">Show Match</div>
              <div className="cont">
                <div
                  className={`option ${
                    state.playedFilter === 'All' ? 'active' : ''
                  }`}
                  onClick={() => showPlayed('All')}
                >
                  All
                </div>
                <div
                  className={`option ${
                    state.playedFilter === 'Yes' ? 'active' : ''
                  }`}
                  onClick={() => showPlayed('Yes')}
                >
                  Played
                </div>
                <div
                  className={`option ${
                    state.playedFilter === 'No' ? 'active' : ''
                  }`}
                  onClick={() => showPlayed('No')}
                >
                  Not Played
                </div>
              </div>
            </div>
            <div className="match_filters_box">
              <div className="tag">Result game</div>
              <div className="cont">
                <div
                  className={`option ${
                    state.resultFilter === 'All' ? 'active' : ''
                  }`}
                  onClick={() => showResult('All')}
                >
                  All
                </div>
                <div
                  className={`option ${
                    state.resultFilter === 'W' ? 'active' : ''
                  }`}
                  onClick={() => showResult('W')}
                >
                  Win
                </div>
                <div
                  className={`option ${
                    state.resultFilter === 'L' ? 'active' : ''
                  }`}
                  onClick={() => showResult('L')}
                >
                  Lose
                </div>
                <div
                  className={`option ${
                    state.resultFilter === 'D' ? 'active' : ''
                  }`}
                  onClick={() => showResult('D')}
                >
                  Draw
                </div>
              </div>
            </div>
          </div>
          <MatchesList matches={state.filterMatches} />
        </div>
        <div className="right">
          <LeagueTable />
        </div>
      </div>
    </div>
  )
}

export default Matches
