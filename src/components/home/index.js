import React from 'react'

import Featured from './featured'
import Matches from './matches'
import Players from './players'

const Home = () => {
  return (
    <div className="bck_blue">
      <Featured />
      <Matches />
      <Players />
    </div>
  )
}

export default Home
