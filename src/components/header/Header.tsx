import logo from '/static/images/SoS_Logo.png'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom';
const Header = () => {
   return (
      <>
         <nav className="py-4 bg-[url('/static/images/Website-Background.png')]">
            <div className="flex items-center justify-between h-20">
               <div>
                  <a className="">
                        <img src={logo} alt="logo" className='w-[290px] h-[42px]'/>
                  </a>
               </div>
               <div >
                  <Button className='!bg-[#FB8A2E] !text-white !font-bold !mr-5'><Link to='/pricing'>Free Trial</Link></Button>
                  <Button className='!bg-[#0714BD] !text-white !font-bold' >
                     <Link to='/login'>Login</Link>
                      </Button>
               </div>
            </div>
         </nav>
      </>
   );
};

export default Header;
