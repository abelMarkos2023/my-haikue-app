import React from 'react'
import { getCookies } from '../../lib/cookieHelper'
import Link from 'next/link';
import { logout } from '../../actions/registrationActions';

const Header = () => {

    const user = getCookies();
  return (
    <div>
        <header className=' bg-gray-100 border-b mb-8 shadow-lg rounded-md'>
        <div className="max-w-6xl mx-auto">
        <div className="navbar">
  <div className="flex-1">
    <Link href='/' className="btn btn-ghost text-2xl">OurHaikuApp</Link>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-1">
     {!user && (<li className='font-bold text-xl'><Link href='/login'>Login</Link></li>)}
     {user && ( 
        <div className='flex items-center gap-2 mr-3'>
        <li>
          <Link href='/create-haikue' className='btn btn-primary mr-2'>Create Haikue</Link>
        </li>
          <li>
            <form action={logout} className="btn btn-neutral">
                <button type="submit">Logout</button>
            </form>
        </li>
        </div>
        
      )
        }
     

     {
      user && ( <li>
        <details>
          <summary>Account</summary>
          <ul className="bg-base-100 rounded-t-none p-2">
            <li><Link href='/'>{user?.username}</Link></li>
            <li><Link href='/'>{user?.email}</Link></li>
          </ul>
        </details>
      </li>)
     }
    </ul>
  </div>
        </div>
        </div>
        </header>
    </div>
  )
}

export default Header