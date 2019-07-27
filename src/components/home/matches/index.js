import React from 'react'

import { Tag } from '../../utils/misc'
import Blocks from './Blocks'

const MacthesHome = () => {
  return (
    <div className="home_matches_wrapper">
      <div className="container">
        <Tag bck="#0e1731" size="50px" color="#ffffff" add={{}}>
          Matches
        </Tag>
        <Blocks />
        <Tag
          bck="#0e1731"
          size="50px"
          color="#ffffff"
          link={true}
          linkTo="/the_team"
        >
          See more matches
        </Tag>
      </div>
    </div>
  )
}

export default MacthesHome
