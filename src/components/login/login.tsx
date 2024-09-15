import LoginContent from './loginContent'
import logo from '/static/images/SoS_Logo.png' 
import SideImg from '/static/images/sideImage.png' 
import { Link } from 'react-router-dom'
import bgImage from '/static/images/Website-Background.png'
const LoginForm=()=>{
    return (
        <>
            <div className="relative flex items-stretch justify-between h-screen" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="relative w-full 2xl:w-[70%] xl:w-[60%] bg-transparent">
                <div className="relative z-10 flex items-center justify-between py-12 text-center 2xl:px-20 xl:px-28 lg:px-28">
                    <a className="">
                        <img src={logo} alt="Logo" className='2xl:w-[290px] xl:w-[220px] lg:w-[180px] 2xl:h-[42px] xl:h-[32px]' />
                    </a>
                    <p className='text-[14px] mt-5 lg:ml-40 md:ml-20 relative z-10 flex flex-col '>
                        Don't have an account? 
                        <span className='text-[16px] font-bold !pl-1 mt-2'>
                            <Link to='/pricing'> Sign up!</Link> 
                        </span>
                    </p>
                </div>
                <div className='relative z-10 text-center'>
                    <LoginContent />
                </div>
            </div>
            <div className="relative w-full 2xl:w-[34%] xl:w-[45%] lg:w-[45%] bg-transparent">
                <img src={SideImg} alt="Side Image" className='object-cover w-full h-screen' />
                <div className="absolute bottom-12 w-[90%] left-12 h-[25%] z-20">
                    {/* <div className="!bg-[url('public/static/images/Rectangle-side.png')] w-full h-full p-5">
                        <p className='2xl:w-[80%] xl:w-[65%] lg:w-[80%] h-[45px] bg-[#0714BD] rounded-lg p-3 flex items-center'>
                            <img src={thumbsUp} alt="Thumbs Up" className='mr-1' />
                            Top Notch Music Resources
                        </p>
                        <p className='mt-5'>
                            Today, we create innovative solutions to the challenges that consumers face in both their everyday lives and events.
                        </p>
                    </div> */}
                </div>
            </div>
        </div>
      </>
    )
}


export default LoginForm