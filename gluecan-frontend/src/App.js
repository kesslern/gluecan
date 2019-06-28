import React, { useCallback, useState } from 'react';
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import './App.css';

function App() {
  const [pastes, setPastes] = useState(null)

  const loadPastes = useCallback(() => {
    fetch('/api/pastes', { headers: {'X-Auth': 'change_me'} })
      .then(it => it.json())
      .then(it => {
        console.log(it)
        setPastes(it)
      })
      .catch(() => console.log("error"))
  }, [setPastes])

  return (
    <div className="App">
      <CssBaseline/>
      <Button variant="contained" color="primary" onClick={loadPastes}>
        Load Pastes
      </Button>
      {pastes && pastes.map(paste =>
        <div key={paste.id}>
          <div>{paste.id}</div>
          <div>{paste.text}</div>
        </div>
      )}
      <Typography>Hello, world!</Typography>
    </div>
  );
}

export default App;
