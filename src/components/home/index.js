import React from 'react'

import Featured from './featured'
import Matches from './matches'
import Players from './players'
import Promotion from './promotion'

const Home = () => {
  return (
    <div className="bck_blue">
      <Featured />
      <Matches />
      <Players />
      <Promotion />
    </div>
  )
}

export default Home
