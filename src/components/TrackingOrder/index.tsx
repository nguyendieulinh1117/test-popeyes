import React from 'react'
import styles from "./index.module.scss"

const TrackingOrder = ({children}:any) => {
  return (
    <div className={styles.tracking}>
        {children}
    </div>
  )
}

export default TrackingOrder