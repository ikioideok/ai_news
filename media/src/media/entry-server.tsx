import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App' // 実際のメディア側Appのパスに合わせて

export function render() {
  const html = renderToString(<App />)
  return { html }
}
