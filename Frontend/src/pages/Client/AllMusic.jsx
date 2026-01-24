import React, { useState } from 'react'
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';

const AllMusic = () => {
    const [selected, setSelected] = useState('');

    // Use this state to hover a list depending on audio_id or audio index
    const [isHovering, setIsHovering] = useState(false);

    const [selectionDisplayed, setSelectionDisplayed] = useState(false);
    const handleDisplaySelection = () => {
        setSelectionDisplayed(prev => !prev)
    }

    return (
        <div className='relative w-full justify-center items-start min-h-screen bg-[#FFF]'>
            <NavigationBar />

            {/* Search filter */}
            <div className='flex w-full justify-center items-center p-2 border-b border-b-[#E1E1E1]'>
                <input type="text" placeholder='Search' className='py-1 px-3 w-[500px] text-[14px] rounded-[5px] border-none focus:border-none focus:outline-none bg-[#E1E1E1]'/>
            </div>

            {/* MAIN CONTENT */}
            <div className='flex flex-col justify-start items-center w-full px-[8rem] min-h-[750px] gap-4 '>
                <div className='flex flex-col w-full items-start justify-center py-[2rem] gap-5'>
                    <div className='relative flex items-center justify-center gap-4'>
                        <div className='text-[#141414] text-[48px] font-bold leading-[35px]'>Hip-Hop</div>
                        <button onClick={handleDisplaySelection} className='flex items-center justify-center'>
                            <img src="/src/assets/icons/arrow-down-sign-to-navigate.png" alt="dropdown-arrow"  className={`${selectionDisplayed ? 'rotate-180' : 'rotate-0'} size-5`}/>
                        </button>

                        { selectionDisplayed && (
                            <div className='absolute top-14 left-0 flex flex-col items-start w-[200px] max-h-[300px] overflow-y-scroll scrollbar-thin bg-[#FFF] border border-[#BABABA] rounded-[5px]'>
                                <button className='flex px-5 py-1 hover:bg-[#dddddd] active:bg-[#FFF] w-full'>Selection 1</button>
                                <button className='flex px-5 py-1 hover:bg-[#dddddd] active:bg-[#FFF] w-full'>Selection 2</button>
                                <button className='flex px-5 py-1 hover:bg-[#dddddd] active:bg-[#FFF] w-full'>Selection 3</button>
                            </div>
                        )}
                    </div>

                    <span className='text-[#141414]'>
                        Add a short description about the user's selected filter (genre/category)
                    </span>

                    <div className='flex gap-2 items-center justify-start'>
                        <label htmlFor="beat_tapes" className={`${selected === 'Beat Tapes' ? 'bg-[#03f8c5] border-[#007F80]' : 'border-[#141414]' } px-3 py-1 border rounded-[5px] hover:opacity-75 cursor-pointer`}>
                            Beat Tapes
                            <input type="radio" name="filter" id="beat_tapes" value={"Beat Tapes"} onChange={(e) => setSelected(e.target.value)} className='hidden'/>
                        </label>
                        
                        <label htmlFor="bundles" className={`${selected === 'Bundles' ? 'bg-[#03f8c5] border-[#007F80]' : 'text-[#141414] border-[#141414]' } px-3 py-1 border  rounded-[5px] hover:opacity-75 cursor-pointer`}>
                            Bundles
                            <input type="radio" name="filter" id="bundles" value={"Bundles"} onChange={(e) => setSelected(e.target.value)} className='hidden'/>
                        </label>

                        <label htmlFor="all" className={`${selected === 'All' ? 'bg-[#03f8c5] border-[#007F80]' : 'border-[#141414]' } px-3 py-1 border  rounded-[5px] hover:opacity-75 cursor-pointer`}>
                            All
                            <input type="radio" name="filter" id="all" value={"All"} onChange={(e) => setSelected(e.target.value)} className='hidden'/>
                        </label>
                    </div>
                </div>


                <label className='flex flex-row items-start w-full text-[24px] text-[#141414] font-bold'>Beat Tapes</label>
                <table className='flex flex-col w-full text-[#FFF]'>
                    <thead className='flex w-full'>
                        <tr className='grid grid-cols-[5%_5%_40%_15%_15%_5%_15%] place-items-center justify-items-center w-full border-b border-b-[#BABABA] py-2 text-[#141414]'>
                            <th>Bundle</th>
                            <th></th>
                            <th>Title</th>
                            <th>Duration</th>
                            <th>Key</th>
                            <th>BPM</th>
                            <th>Price</th>
                        </tr>
                    </thead>

                    <tbody>

                        {/* Set a map index or assign audio_id to track which audio is being hovered */}
                        {/* This block is for beat tapes showing in a list format but displays in more details */}
                        <tr onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} className='grid grid-cols-[5%_5%_40%_15%_15%_5%_15%] w-full  py-2 place-items-center justify-items-center text-[14px] text-[#141414] hover:bg-[#EEE] cursor-pointer transition-all duration-100'>
                            <td className='flex items-center justify-center w-full'>
                                <img src="/src/assets/Image/sample_bundle_art.jpg" alt="bundle_image" className='size-10'/>
                            </td>
                            <td className='flex justify-center items-center w-full'>
                                <button className='w-full h-full flex items-center justify-center'>
                                    <img src={`/src/assets/icons/play_${!isHovering ? 'black' : 'teal'}.png`} alt="play-button" className='size-6'/>
                                </button>
                            </td>
                            <td className='px-2 max-w-[400px] truncate'>Title of the audio which is super super duper long as long as talong</td>
                            <td>1:00</td>
                            <td>A min</td>
                            <td>80</td>
                            <td className='flex w-full px-2'>
                                <button className='flex items-center justify-center w-full gap-2 px-2 py-2 bg-[#03f8c5] text-[#141414] text-[16px] whitespace-nowrap rounded-[8px] hover:bg-[#EADCA7] active:bg-[#03f8c5] transition-all duration-100'>
                                    ₱ 1000.00
                                </button>
                            </td>
                        </tr>

                    </tbody>
                </table>

                <div className='flex flex-col w-full items-start gap-2 py-[2rem]'>
                    <span className='text-[24px] text-[#141414] font-bold'>Bundles</span>
                    <div className='grid grid-cols-5 w-full gap-2'>

                        <div className='flex flex-col justify-center border border-[#DDDDDD] bg-[#EEEEEE] box-border transform transition-all duration-100 t hover:-translate-y-0.5 hover:bg-[#DDD] active:bg-[#EEEEEE] p-4 rounded-[5px]'>
                            <div className='relative h-[260px] w-auto bg-[#656565] flex items-center justify-center'>
                                <img src="/src/assets/Image/sample_bundle_art.jpg" alt="cover-art" className='w-auto h-full fill-contain'/>

                                <div className='absolute top-3 left-3 bg-[#841818] px-2 flex items-center justify-center'>
                                    <span className='text-[14px] text-[#FFF]'>Hip-Hop</span>
                                </div>
                            </div>
                            <div className='flex flex-col justify-center w-full pt-2'>
                                <span className='font-bold text-[#141414] text-[18px]'>Title</span>
                                <span className='text-[#656565] text-[16px]'>30 Beat Tapes</span>
                            </div>
                        </div>

                        <div className='flex flex-col justify-center border border-[#DDDDDD] bg-[#EEEEEE] box-border transform transition-all duration-100 t hover:-translate-y-0.5 hover:bg-[#DDD] active:bg-[#EEEEEE] p-4 rounded-[5px]'>
                            <div className='relative h-[260px] w-auto bg-[#656565] flex items-center justify-center'>
                                <img src="/src/assets/Image/sample_bundle_art.jpg" alt="cover-art" className='w-auto h-full fill-contain'/>

                                <div className='absolute top-3 left-3 bg-[#841818] px-2 flex items-center justify-center'>
                                    <span className='text-[14px] text-[#FFF]'>Hip-Hop</span>
                                </div>
                            </div>
                            <div className='flex flex-col justify-center w-full pt-2'>
                                <span className='font-bold text-[#141414] text-[18px]'>Title</span>
                                <span className='text-[#656565] text-[16px]'>30 Beat Tapes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    )
}

export default AllMusic