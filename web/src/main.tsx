import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import KindWorldApp from './KindWorldApp'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <KindWorldApp />
    </Provider>
  </React.StrictMode>,
)
