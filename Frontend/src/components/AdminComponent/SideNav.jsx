import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const SideNav = () => {
    const location = useLocation();

    return (
        <div className="sticky top-[64px] flex flex-col bg-[#141414] h-[calc(100vh-64px)] border-r border-r-[#FFF]/15 p-2 gap-1 z-10">
            <div className='flex flex-col h-full gap-1'>
                <Link to="/dashboard" className={`${location.pathname === '/dashboard' ? 'bg-[#03f8c5] text-[#141414]' : 'hover:bg-[#EADCA7]/50 text-[#FFF]'} p-2  rounded-[5px] text-[14px] font-bold`}>
                    Dashboard
                </Link>

                <Link to="/manage" className={`${location.pathname === '/manage' ? 'bg-[#03f8c5] text-[#141414]' : 'hover:bg-[#EADCA7]/50 text-[#FFF]'} p-2  rounded-[5px] text-[14px] font-bold`}>
                    Manage
                </Link>
                <Link to="/create" className={`${location.pathname === '/create' ? 'bg-[#03f8c5] text-[#141414]' : 'hover:bg-[#EADCA7]/50 text-[#FFF]'} p-2 rounded-[5px] text-[14px] font-bold`}>
                    Create
                </Link>
                <div className='flex flex-col w-full gap-1 p-2'>
                    <span className='text-[12px] font-bold text-[#FFF]/50'>Catalog</span>
                    <Link to="/catalog/singles" className={`${location.pathname === '/catalog/singles' ? 'bg-[#03f8c5] text-[#141414]' : 'hover:bg-[#EADCA7]/50 text-[#FFF]'} p-2 rounded-[5px] text-[14px] font-bold`}>
                        Singles
                    </Link>
                    <Link to="/catalog/beat-tapes" className={`${location.pathname === '/catalog/beat-tapes' ? 'bg-[#03f8c5] text-[#141414]' : 'hover:bg-[#EADCA7]/50 text-[#FFF]'} p-2 rounded-[5px] text-[14px] font-bold`}>
                        Beat Tapes
                    </Link>
                </div>
            </div>


        </div>
    );
};


export default SideNav