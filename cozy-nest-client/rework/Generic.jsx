import React from 'react'
import './Generic.scss'


export function Row(props) {

    const className = props.className ? props.className + ' Row' : 'Row'

    return <div
        {...props}
        className={className}>
        {props.children}
    </div>
}

export const Column = (props) => {

      const className = props.className ? props.className + ' Column' : 'Column'

      return <div
          {...props}
          className={className}>
          {props.children}
      </div>
}
