import { FC } from 'react'
import BasicForm from './Form'

const App: FC = () => {
  return (
    <div>
      <h1>ZOD tutorial</h1>
      <a href='https://zod.dev/' target='_blank'>Documentation</a>

      <h2>Basic Form example</h2>
      <BasicForm />
    </div>
  )
}

export default App