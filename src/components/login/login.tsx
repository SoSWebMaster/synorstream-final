import LoginContent from './loginContent'
import logo from '/static/images/SoS_Logo.png' 
import SideImg from '/static/images/sideImage.png' 
import thumbsUp from '/static/images/thumbs-up.png' 
import { Link } from 'react-router-dom'
import bgImage from '/static/images/Website-Background.png'
const LoginForm=()=>{
    return (
        <>
            <div className="flex justify-between  !h-[100vh]" style={{ backgroundImage: `url(${bgImage})` }}>
                <div className=" 2xl:w-[70%] xl:w-[60%] ">
                    <div className="flex items-center justify-between py-12 text-center 2xl:px-20 xl:px-28 lg:px-28">
                    <a className="">
                        <img src={logo} alt="" className='2xl:w-[290px] xl:w-[220px] lg:w-[180px] 2xl:h-[42px] xl:h-[32px]'/>
                    </a>
                        <p className='text-[14px] mt-5 lg:ml-32'>Don’t have an account? <span className='text-[14px] font-bold !pl-1'><Link to='/pricing'> Sign up!</Link> </span></p>
                    </div>
                    <div className='text-center'>
                        <LoginContent/>
                    </div>
                
                </div>
                <div  className=" !h-[100vh] absolute right-0 2xl:w-[34%] xl:w-[45%] lg:w-[45%]">
                    <img src={SideImg} alt="" className='!h-[100vh] relative !w-full'/>
                    <div className="absolute bottom-12 w-[90%] left-12 h-[25%] ">
                        <div className="!bg-[url('public/static/images/Rectangle-side.png')] w-[90%] !h-full">
                            <div className='xl:p-10 sm:p-5'>
                                <p className='2xl:w-[80%] xl:w-[65%] lg:w-[80%] h-[45px] bg-[#0714BD] rounded-lg p-3 flex'>  <img src={thumbsUp} alt="thumbs" className='mr-1'/> Top Notch Music Resources</p>
                                <p className='mt-5'>Today, we create innovative solutions to the challenges that consumers face in both their everyday lives and events.</p>
                            </div>
                        </div>
                          
                    </div>
                </div>
            </div>
        </>
    )
}


export default LoginForm