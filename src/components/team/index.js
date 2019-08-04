import React, { useState, useEffect } from 'react'
import Fade from 'react-reveal/Fade'
import { Promise } from 'core-js'

import Stripes from '../../resources/images/stripes.png'
import PlayerCard from '../utils/PlayerCard'
import { firebaseLooper } from '../utils/misc'
import { firebasePlayers, firebase } from '../../firebase'

const Team = () => {
  const [state, setState] = useState({
    loading: true,
    players: [],
  })

  useEffect(() => {
    firebasePlayers.once('value').then(snapshot => {
      const players = firebaseLooper(snapshot)
      let promises = []

      for (let key in players) {
        promises.push(
          new Promise((resolve, reject) => {
            firebase
              .storage()
              .ref('players')
              .child(players[key].image)
              .getDownloadURL()
              .then(url => {
                players[key].url = url
                resolve()
              })
              .catch(err => {
                reject()
              })
          })
        )
      }

      Promise.all(promises)
        .then(() => {
          setState({
            ...state,
            loading: false,
            players,
          })
        })
        .catch(err => {
          setState({
            ...state,
            loading: false,
            players,
          })
        })
    })
  }, [])

  const showPlayersByCategory = category =>
    state.players
      ? state.players.map((player, i) => {
          return player.position === category ? (
            <Fade left delay={i * 20} key={i}>
              <div className="item">
                <PlayerCard
                  number={player.number}
                  name={player.name}
                  lastname={player.lastname}
                  bck={player.url}
                />
              </div>
            </Fade>
          ) : null
        })
      : null

  return (
    <div
      className="the_team_container"
      style={{ background: `url(${Stripes}) repeat` }}
    >
      {!state.loading ? (
        <div>
          <div className="team_category_wrapper">
            <div className="title">Keepers</div>
            <div className="team_cards">{showPlayersByCategory('Keeper')}</div>
          </div>
          <div className="team_category_wrapper">
            <div className="title">Defenders</div>
            <div className="team_cards">{showPlayersByCategory('Defence')}</div>
          </div>
          <div className="team_category_wrapper">
            <div className="title">Midfielders</div>
            <div className="team_cards">
              {showPlayersByCategory('Midfield')}
            </div>
          </div>
          <div className="team_category_wrapper">
            <div className="title">Forwards</div>
            <div className="team_cards">{showPlayersByCategory('Striker')}</div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Team
