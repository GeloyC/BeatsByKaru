import React from 'react'
import NavigationBar from '../../components/NavigationBar'
import Footer from '../../components/Footer'

const Projects = () => {
  return (
    <div className='relative flex flex-col w-full min-h-screen justify-start items-center'>
        <NavigationBar />

        <div className='flex flex-col justify-start items-center w-full'>
          <div className='flex flex-col items-center justify-center w-full h-[400px] bg-[#1E1E1E] px-[8rem] gap-3'> 
            <span className='font-bold text-[60px] text-[#03f8c5]'>Projects</span>
            <span className='text-[#FFF] text-[18px w-[600px] text-center'>Add a short paragraph here that describes what this page shows to the user. Add what they need to expect</span>
          </div>

          <div className='flex flex-col item-center gap-[6rem] p-[8rem] w-full bg-[#FFF]'>
            {/* Section */}
            <div className='grid grid-cols-2 w-full'>  
              <div className='flex items-center justify-center w-full h-[400px] bg-[#141414] rounded-[10px]'>
                  asdasd
              </div>

              <div className='flex flex-col items-center justify-center gap-4'> 
                <span className='font-bold text-[36px] text-[#141414]'>Title of the Paragraph</span>
                <span className='text-[#141414] text-[18px]'>Add a short and simple paragraph here describing what the image displays.</span>
              </div>
            </div>

            {/* Section */}
            <div className='grid grid-cols-2 w-full'>  
              <div className='flex items-center justify-center w-full h-[400px] bg-[#141414] rounded-[10px]'>
                  asdasd
              </div>

              <div className='flex flex-col items-center justify-center gap-4'> 
                <span className='font-bold text-[36px] text-[#141414]'>Title of the Paragraph</span>
                <span className='text-[#141414] text-[18px]'>Add a short and simple paragraph here describing what the image displays.</span>
              </div>

            </div>
          </div>

        </div>

        <Footer />
    </div>
  )
}

export default Projects