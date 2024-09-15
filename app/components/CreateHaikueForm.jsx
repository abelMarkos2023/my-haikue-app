'use client'
import {useState} from 'react'
import {useFormState,useFormStatus} from 'react-dom'
import ErrorAlert from '../components/Alerts/ErrorAlert'
import {CldUploadWidget} from 'next-cloudinary'

import { createHaikue, editHaikue } from '../../actions/haikueController'

export default  function CreateHaikueForm(props){

    const [imageData,setImageData] = useState({signature:'',public_id:'',version:''})
    let action;

    if(props.action === 'edit'){
        action = editHaikue;
    }else{
        action = createHaikue;
    }
    const [formState,formAction] = useFormState(action,{})

    console.log(props.haikue)

    return (
    <>
    <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        {
            props.action == 'create' ? 'Create Haikue' : 'Update Haikue'
        }
    </h2>
    <form action={formAction} className="max-w-md mx-auto">
            
        <div className="mb-3">
        <input name='line1' 
        type="text" 
        placeholder={props.action == 'create' ? "Line #1" : '' }className="input input-bordered w-full max-w-md" 
        defaultValue={props.action == 'edit' ? props.haikue?.line1 : ''}
        />
        {
            formState?.errors?.line1 && <ErrorAlert msg={formState.errors.line1} /> 
        }
        </div>

        <div className="mb-3">
        <input name='line2'
         type="text" 
         placeholder= {props.action == 'create' ? "Line #2" :''}
         className="input input-bordered w-full max-w-md"
         defaultValue={props.action == 'edit' ? props.haikue?.line2 : ''}

         />
        {
            formState?.errors?.line2 && <ErrorAlert msg={formState.errors.line2} />
        }
        </div>

        <div className="mb-3">
        <input name='line3' 
        type="text" 
        placeholder={props.action == 'create' ? "Line #3" : ''} 
        className="input input-bordered w-full max-w-md" 
        defaultValue={props.action == 'edit' ? props.haikue?.line3 : ''}

        />
        {
            formState?.errors?.line3 && <ErrorAlert msg={formState.errors.line3} />
        }
        </div>
        {
            props.action == 'edit' && (
                <div className="mb-3">
        <input 
        type="hidden"
        name="haikueId" 
        value={props.haikue._id}
        />
        <input 
        type="hidden"
        name="userId" 
        value={props.haikue.userId}
        />
        </div>
            )
        }

    <div className="my-4">
    <CldUploadWidget 
        onSuccess = {(result,{widget}) => {
            console.log(result?.info)
            setImageData({
                public_id:result?.info.public_id,
                version:result?.info.version,
                signature:result?.info.signature})
         

        }}
        
        onQueuesEnd={(result,{widget}) => {
            widget.close()
        //console.log(result)
    }} signatureEndpoint="/widget-signature">
  {({ open }) => {
    return (
      <button className = 'btn btn-secondary' onClick={(e) => {
        e.preventDefault();
        open()
      }}>
        Upload an Image
      </button>
    );
  }}
</CldUploadWidget>
    </div>
        <input type="hidden" name="public_id" value={imageData.public_id} />
        <input type="hidden" name="signature" value={imageData.signature} />
        <input type="hidden" name="version" value={imageData.version} />

        <button type='submit' className="btn btn-secondary">
            {
                props.action == 'create' ? 'Create Haikue' : 'Update Haikue'
            }
        </button>
</form>

    </>
    )
}