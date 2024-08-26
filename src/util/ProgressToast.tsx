import { useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

const ProgressToast = ({ percentage }:any) => {
    useEffect(()=>{
    
    },[percentage])
return (
    <>
     <Box sx={{ width: '100%' }}>
    <LinearProgress variant="determinate" value={percentage} />
    <Box sx={{ mt: 1, textAlign: 'center' }}>{`${percentage}%`}</Box>
  </Box>
    </>
)
 
}

export default ProgressToast;