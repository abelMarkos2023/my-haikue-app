import {redirect} from 'next/navigation';

import {getCookies} from '../../lib/cookieHelper'
import CreateHaikueForm from '../components/CreateHaikueForm';

export default async function CreateHaikue(){
  
    const userId = getCookies();

    if(!userId) return redirect('/')

    return (
    <>
    <CreateHaikueForm action={'create'}/>
    </>
    )
}