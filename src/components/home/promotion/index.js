import React from 'react'

import AnimationPromotion from './Animation'
import Enrol from './Enrol'

const Promotion = () => {
  return (
    <div className="promotion_wrapper" style={{ background: `#ffffff` }}>
      <div className="container">
        <AnimationPromotion />
        <Enrol />
      </div>
    </div>
  )
}

export default Promotion
