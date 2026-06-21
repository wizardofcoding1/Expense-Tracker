import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({children})=>{
  const {user,loading} = useAuth();

  if(loading){
    return (
      <div className='flex h-screen items-center justify-center bg-obsidian-950 text-white'>
        <div className='flex flex-col items-center gap-3'>
          <div className='h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent'> </div>
            <p className='text-zinc-400 font-medium'>
              Checking Authentication.......
            </p>
         
        </div>

      </div>
    );
  }
  if(!user){
    return <Navigate to='/login' replace />
  }

  return children;
}

export default ProtectedRoute;