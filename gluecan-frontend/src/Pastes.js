import React from 'react'

export default function Pastes({ pastes }) {
  return pastes && pastes.map(paste =>
    <div key={paste.id}>
      <div>{paste.id}</div>
      <div>{paste.text}</div>
    </div>
  )
}
