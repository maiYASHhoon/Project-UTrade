/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {getUserByToken, login} from '../core/_requests'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {useAuth} from '../core/Auth'
import APICallService from '../../../../api/apiCallService'
import {LOGIN} from '../../../../api/apiEndPoints'
import {APIJSON} from '../../../../api/apiJSON/auth'

const loginSchema = Yup.object().shape({
  email: Yup.string()
  .email('Wrong email format')
  .min(3, 'Minimum 3 symbols')
  .max(50, 'Maximum 50 symbols')
  .required('Email is required'),
  password: Yup.string()
  .min(3, 'Minimum 3 symbols')
  .max(50, 'Maximum 50 symbols')
  .required('Password is required'),
})

const initialValues = {
  email: 'admin@demo.com',
  password: 'demo',
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export const Login = () => {
  const [loading, setLoading] = useState(false)
  const {saveAuth, saveCurrentUser} = useAuth()

  const formik: any = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        let apiService = new APICallService(
          LOGIN,
          APIJSON.login({email: values.email, password: values.password})
        )
        let response = await apiService.callAPI()
        if (response) {
          saveAuth(response.token)
          let user = response.user
          saveCurrentUser(user)
        }
      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setStatus('The login details are incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      <div className='text-center mh-353px mw-382px mt-208px mb-207px'>
        {/* begin::Heading */}
        <div className='text-start mb-11'>
          <h1 className='text-dark fw-bolder mb-3'>
            Sign in to your seller
            <br /> Business account!
          </h1>
        </div>
        {/* begin::Heading */}

        {/* begin::Form group */}
        <div className='fv-row mb-3'>
          <input
            placeholder='Email or mobile phone number'
            {...formik.getFieldProps('email')}
            className={clsx(
              'form-control bg-light',
              {'is-invalid': formik.touched.email && formik.errors.email},
              {
                'is-valid': formik.touched.email && !formik.errors.email,
              }
            )}
            type='email'
            name='email'
            autoComplete='off'
          />
          {formik.touched.email && formik.errors.email && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block text-start'>
                <span role='alert'>{formik.errors.email}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
        <div className='fv-row mb-3'>
          {/* <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label> */}
          <input
            type='Password'
            placeholder='password'
            autoComplete='off'
            {...formik.getFieldProps('password')}
            className={clsx(
              'form-control bg-light text-left',
              {
                'is-invalid': formik.touched.password && formik.errors.password,
              },
              {
                'is-valid': formik.touched.password && !formik.errors.password,
              }
            )}
          />
          {formik.touched.password && formik.errors.password && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block text-start'>
                <span role='alert'>{formik.errors.password}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Action */}
        <div className='d-grid mb-3'>
          <button
            type='submit'
            id='kt_sign_in_submit'
            className='btn btn-primary'
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {!loading && <span className='indicator-label'>Continue</span>}
            {loading && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
        {/* end::Action */}

        {/* begin::Wrapper */}
        <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8 justify-content-center'>
          {/* begin::Link */}
          <Link to='/auth/forgot-password' className='link-primary'>
            Forgot Password ?
          </Link>
          {/* end::Link */}
        </div>
        {/* end::Wrapper */}
      </div>
      <div className='d-flex flex-center'>
        <div className='text-gray-500 text-center fw-semibold fs-6 position-absolute bottom-0 pb-5'>
          Don’t have an account?{' '}
          <Link to='/auth/registration' className='link-primary '>
            Sign up
          </Link>
        </div>
      </div>
    </form>
  )
}
