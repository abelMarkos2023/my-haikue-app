'use client'
import {register} from '../../actions/registrationActions'
import {useFormState,useFormStatus} from 'react-dom'
import ErrorAlert from './Alerts/ErrorAlert'

export default function RegisterForm(){

    const [formState,formAction] = useFormState(register,{})

    console.log(formState)
    return (<>
         <form action={formAction} className="max-w-md mx-auto">

            <div className="mb-3">
            <input name='username' type="text" placeholder="Username" className="input input-bordered w-full max-w-md" />
            {formState?.errors?.username && <ErrorAlert msg={formState.errors.username} /> }
            </div>

            <div className="mb-3">
            <input name='email' type="text" placeholder="Your Email Address..." className="input input-bordered w-full max-w-md" />
            {formState?.errors?.email && <ErrorAlert msg={formState.errors.email} /> }
            </div>

            <div className="mb-3">
            <input name='password' type="password" placeholder="Password" className="input input-bordered w-full max-w-md" />
            {formState?.errors?.password && <ErrorAlert msg={formState.errors.password} />}
            </div>

            <div className="mb-3">
            <input name='confirmPassword' type="password" placeholder="COnfirm Password" className="input input-bordered w-full max-w-md" />
            {formState?.errors?.confirmPassword && <ErrorAlert msg={formState.errors.confirmPassword} />}
            </div>
            <button type='submit' className="btn btn-secondary">Create an Account</button>
</form>

    </>)
}