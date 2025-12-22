import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const base_url = `http://localhost:5000`;
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleShowPassword = () => {
    setPassword(prev => !prev)
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${base_url}/user/login`, {
        username: username, 
        password: password
      }, {
        withCredentials: true
      });

      navigate('/dashboard');
    } catch(err) {
      console.error('Failed to login, something went wrong: ', err);
    }
  }

  return (
    <div className='flex flex col items-center justify-center w-full h-screen bg-[#FFF]'>
        <div className='flex flex-col items-center justify-center w-[400px] h-auto gap-5'>
          <div className='flex items-center justify-between w-full'>
            <Link to='/' title='Home' className='px-2 py-0.5 rounded-[5px] rotate-180 bg-[#EEE] hover:bg-[#CCC] active:bg-[#EEE]'>
              <img src="/src/assets/icons/right-arrows-black.png" alt="arrow" className='size-6'/>
            </Link>
            <span className='text-[22px] text-[#2A2A2A] font-bold'>Log in</span>
          </div>
          <form onSubmit={handleAdminLogin} className='flex flex-col items-center justify-center  w-full gap-5'>
            <div className='flex flex-col items w-full gap-1'>
              <span className='text-[14px] font-bold text-[#2A2A2A]'>Username</span>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className='bg-[#EEE] p-2 text-[16px] rounded-[5px] border border-[#DDD] focus:border-[#007F80] focus:outline-none'/>
            </div>

            <div className='flex flex-col items w-full gap-1'>
              <div className='flex items-center w-full justify-between'>
                <span className='text-[14px] text-[#2A2A2A] font-bold'>Password</span>
                <label htmlFor="see_password" className='flex text-[14px] items-center gap-1'>
                  show password
                  <input type="checkbox"  onChange={handleShowPassword} id="see_password" />
                </label>
              </div>
              <input type={password ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className='bg-[#EEE] p-2 text-[16px] rounded-[5px] border border-[#DDD] focus:border-[#007F80] focus:outline-none'/>
            </div>

            <button className='w-full bg-[#007F80] text-[#FFF] py-2 rounded-[5px] font-bold hover:opacity-75 active:opacity-100'>Continue</button>
          </form>  
        </div>
    </div>
  )
}

export default Login