import React, { useEffect } from 'react'

export default function PastesLoader({ setPastes, password, setResult }) {

  useEffect(() => {
    fetch('/api/pastes', { headers: { 'X-Auth': password } })
      .then(it => it.json())
      .then(it => {
        setResult(true)
        setPastes(it)
      })
      .catch(() => {
        setResult(false)
      })
  })

  return null
}
