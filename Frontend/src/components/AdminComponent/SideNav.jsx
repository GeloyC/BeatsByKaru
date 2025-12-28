import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const SideNav = () => {
    const location = useLocation();

    return (
        <div className="sticky top-[64px] flex flex-col bg-[#FFF] h-[calc(100vh-64px)] border-r border-r-[#DDDDDD] p-2 gap-1 z-10">
            <div className='flex flex-col h-full gap-1'>
                <Link to="/dashboard" className={`${location.pathname === '/dashboard' ? 'bg-[#DDD]' : 'hover:bg-[#BBB]'} p-2  rounded-[5px] text-[14px] font-bold`}>
                    Dashboard
                </Link>

                <Link to="/manage" className={`${location.pathname === '/manage' ? 'bg-[#DDD]' : 'hover:bg-[#BBB]'} p-2  rounded-[5px] text-[14px] font-bold`}>
                    Manage
                </Link>
                <Link to="/create" className={`${location.pathname === '/create' ? 'bg-[#DDD]' : 'hover:bg-[#BBB]'} p-2 rounded-[5px] text-[14px] font-bold`}>
                    Create
                </Link>
            </div>


        </div>
    );
};


export default SideNav