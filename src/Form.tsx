import { FC } from 'react'
import { Controller } from 'react-hook-form'
import { FormFields, useMyForm } from './useForm'

const BasicForm: FC = () => {
  const { handleSubmit, errors, control, reset } = useMyForm()

  const onSubmit = handleSubmit(async (formData: FormFields) => {
    console.log('FormData: ', formData)
    reset()
  })

  return (
    <form onSubmit={onSubmit}>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <div className="mb-3">
            <label htmlFor="name">Name</label>
            <input
              {...field}
              type="text"
              placeholder="example@gmail.com"
              aria-label="Name"
              aria-describedby="name"
              className={
                errors.name ? 'form-control is-invalid' : 'form-control'
              }
            />
            {errors.name && (
              <div className="invalid-feedback text-danger">
                {errors.name.message}
              </div>
            )}
          </div>
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input
              {...field}
              type="email"
              placeholder="example@gmail.com"
              aria-label="Email"
              aria-describedby="email"
              className={
                errors.email ? 'form-control is-invalid' : 'form-control'
              }
            />
            {errors.email && (
              <div className="invalid-feedback text-danger">
                {errors.email.message}
              </div>
            )}
          </div>
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              {...field}
              type="password"
              placeholder="******"
              aria-label="Password"
              aria-describedby="password"
              className={
                errors.password ? 'form-control is-invalid' : 'form-control'
              }
            />
            {errors.password && (
              <div className="invalid-feedback text-danger">
                {errors.password.message}
              </div>
            )}
          </div>
        )}
      />
      <button type="submit">
        Submit
      </button>
    </form>
  )
}

export default BasicForm
