import React from 'react'
import TopNav from '../../components/AdminComponent/TopNav'
import SideNav from '../../components/AdminComponent/SideNav'

const Dashboard = () => {
    return (
        <div className='flex flex-col w-full min-h-screen bg-[#FFF]'>
            <TopNav />

            <div className='grid grid-cols-[15%_85%] h-full'>
                <SideNav />

                <div className='flex flex-col w-full p-5'>
                    Dashboard
                </div>
            </div>
        </div>
    )
}

export default Dashboard