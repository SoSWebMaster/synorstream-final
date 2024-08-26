import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add"; // Plus icon
import RemoveIcon from "@mui/icons-material/Remove"; 
const FaqComponent = ({expanded,handleChange,item,index}:any) => {
    // const [expanded, setExpanded] = useState(false);

    // const handleChange = () => {
    //   setExpanded(!expanded);
    // };
   return (
      <>
         <div className="px-5 mt-10">
       
            <Accordion expanded={expanded} onChange={handleChange}
            className="!text-[100px] !font-bold"
               sx={{
                border: '2px solid #FB8A2E',
                bgcolor: 'transparent', 
                marginTop:5,
             
              }}
              key={`${index} + ${item?.question}`}>
               <AccordionSummary
                  expandIcon={expanded ? <RemoveIcon sx={{ color: 'white', fontSize:40 }} /> : <AddIcon sx={{ color: 'white', fontSize:40 }} />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{
                    bgcolor: 'transparent', // Ensure background is transparent for proper color visibility
                    color: 'white', // Text color
                  }}
               >
                  <Typography className="!text-[25px] !font-semibold">{item?.question}</Typography>
               </AccordionSummary>
               <AccordionDetails
                  sx={{
                    color: 'white', // Text color
                    bgcolor: 'transparent', // Ensure background is transparent for proper color visibility
                  }}>
                  <Typography className="!text-[20px] !font-medium">
                     {item?.answer}
                  </Typography>
               </AccordionDetails>
            </Accordion>


            
         </div>
      </>
   );
};

export default FaqComponent;
