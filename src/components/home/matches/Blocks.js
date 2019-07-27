import React, { useState, useEffect } from 'react'
import Slide from 'react-reveal'

import { firebaseMatches } from '../../../firebase'
import { firebaseLooper, reverseArray } from '../../utils/misc'
import MatchesBlock from '../../utils/matches_block'

const Blocks = () => {
  const [state, setState] = useState({ matches: [] })

  useEffect(() => {
    firebaseMatches
      .limitToLast(6)
      .once('value')
      .then(snapshot => {
        const matches = firebaseLooper(snapshot)
        setState({ matches: reverseArray(matches) })
      })
  }, [])

  const showMatches = matches =>
    matches
      ? matches.map((match, i) => (
          <Slide key={match.id} bottom>
            <div className="item">
              <div className="wrapper">
                <MatchesBlock match={match} />
              </div>
            </div>
          </Slide>
        ))
      : null

  return <div className="home_matches">{showMatches(state.matches)}</div>
}

export default Blocks
