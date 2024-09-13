import { Button } from '@mui/material';
import NewPlayer from '../newPlayer/newPlayer';
import { useAppSelector } from '../../store';
import { useEffect, forwardRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

interface HeroSectionProps {
    scrollToSectionRef: React.RefObject<HTMLDivElement>;
}

const HeroSection = forwardRef<HTMLDivElement, HeroSectionProps>(({ scrollToSectionRef }) => {
    const { isLoading } = useAppSelector((state: any) => state.music);

    const scrollToFilter = () => {
        if (scrollToSectionRef.current) {
            scrollToSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        // You can add any side effects here if needed
    }, [isLoading]);

    return (
        <>
            <div className="bg-[url('/static/images/Vector.png')] h-[520px] w-full bg-cover bg-center rounded-lg !pt-28 flex flex-col justify-center items-center">
                <div className="p-12 text-center text-white">
                    <h1 className="text-[48px] font-medium !mb-[-20px]">THE NEW</h1>
                    <h1 className="text-[48px] font-medium">SOUNDWAVE IS HERE</h1>
                    <p className="text-[22px]">Modern music & SFX for streamers, content creators and professionals. </p>
                    <p className="text-[22px]">No generic 'background music' here. </p>
                    <Button
                        className='!bg-[#FB8A2E] !text-white !font-bold !mt-5 w-[180px] h-[43px]'
                        onClick={scrollToFilter}
                    >
                        Browse
                    </Button>
                </div>
                <div className='h-[216px] w-[705px] !border-none'>
                    <div>
                        <NewPlayer />
                    </div>
                    {/* <div className={`text-center ${!isLoading ? '!block' : '!hidden'}`}>
                        <CircularProgress color="primary" size={40} />
                        <NewPlayer />
                    </div> */}
                </div>
            </div>
        </>
    );
});

export default HeroSection;