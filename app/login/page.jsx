'use client'
import {login, register} from '../../actions/registrationActions'
import {useFormState,useFormStatus} from 'react-dom'
import ErrorAlert from '../components/Alerts/ErrorAlert'

export default function Login(){

    const [formState,formAction] = useFormState(login,{})

    return (
        <>
            <h2 className="text-2xl text-gray-800 mb-4">Login page</h2>
            <form action={formAction} className="max-w-md mx-auto">

<div className="mb-3">
<input name='email' type="text" placeholder="Your Email Password....." className="input input-bordered w-full max-w-md" />
{formState?.errors?.email && <ErrorAlert msg={formState.errors.email} /> }
</div>
<div className="mb-3">
<input name='password' type="password" placeholder="Password........." className="input input-bordered w-full max-w-md" />
{formState?.errors?.password && <ErrorAlert msg={formState.errors.password} />}
</div>
<button type='submit' className="btn btn-secondary">Sign In</button>
</form>

        </>
    )
}