import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import reportWebVitals from './reportWebVitals' // For debugging purposes

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)

// Performance metrics for debugging
// reportWebVitals(console.log)
