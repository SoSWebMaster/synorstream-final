import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import useAxios from "../../../services/axiosConfig/axiosConfig";
import { endPoints } from "../../../services/constants/endPoint";
import { useNavigate } from "react-router-dom";

const UrlsPatterns = [
   {
      name: "YouTube",
      btnText: "Add YouTube Address",
      placeHolderText: "YouTube Address",
   },
   {
      name: "FaceBook",
      btnText: "Add FaceBook Address",
      placeHolderText: "FaceBook Address",
   },
   {
      name: "Instagram",
      btnText: "Add Instagram Address",
      placeHolderText: "Instagram Address",
   },
   {
      name: "Twitch",
      btnText: "Add Twitch Address",
      placeHolderText: "Twitch Address",
   },
   {
      name: "Vimeo",
      btnText: "Add Vimeo Address",
      placeHolderText: "Vimeo Address",
   },
   {
      name: "Video",
      btnText: "Add Affiliated Video Link Address",
      placeHolderText: "Affiliated Video Link  Address",
   },
];
const AccordionComponent2 = () => {
   const [inputValues, setInputValues] = React.useState<{
      [key: string]: string;
   }>({});
   const [addresses, setAddresses] = React.useState<{
      [key: string]: string[];
   }>({});
   const axiosInstance = useAxios();
   const navigate = useNavigate();

   // Fetch data on component mount, ensure it runs only once
   React.useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axiosInstance.get(
               endPoints?.copyright_clearance
            );
            const result = response?.data?.result?.[0];

            if (result) {
               // Populate addresses with data from the API
               const initialAddresses = {
                  YouTube: JSON.parse(result.youtube || "[]"),
                  FaceBook: JSON.parse(result.facebook || "[]"),
                  Instagram: JSON.parse(result.instagram || "[]"),
                  Twitch: JSON.parse(result.twitch || "[]"),
                  Vimeo: JSON.parse(result.vimeo || "[]"),
                  Video: JSON.parse(result.video || "[]"),
               };
               setAddresses(initialAddresses);
            }
         } catch (error) {
            toast.error("Failed to load data from server");
         }
      };

      // Make sure fetchData runs only once on component mount
      fetchData();
   }, []); // Empty dependency array means the effect runs only once after the initial render

   const handleAddAddress = (serviceName: string, address: string) => {
      if (address.trim() !== "") {
         setAddresses((prevAddresses) => {
            const newAddresses = { ...prevAddresses };
            if (!newAddresses[serviceName]) {
               newAddresses[serviceName] = [];
            }
            if (!newAddresses[serviceName].includes(address)) {
               newAddresses[serviceName].push(address);
            } else {
               toast.error("This URL is already added!");
            }
            return newAddresses;
         });
      }
   };

   const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      serviceName: string
   ) => {
      setInputValues((prevValues) => ({
         ...prevValues,
         [serviceName]: e.target.value,
      }));
   };

   const removeUrl = (serviceName: string, address: string) => {
      setAddresses((prevAddresses) => {
         const newAddresses = { ...prevAddresses };
         newAddresses[serviceName] = newAddresses[serviceName].filter(
            (add) => add !== address
         );
         return newAddresses;
      });
   };

   const handleAddButtonClick = (serviceName: string) => {
      const inputValue = inputValues[serviceName] || "";
      handleAddAddress(serviceName, inputValue);
      setInputValues((prevValues) => ({
         ...prevValues,
         [serviceName]: "",
      }));
   };

   const keys = [
      "FaceBook",
      "Instagram",
      "YouTube",
      "Twitch",
      "Vimeo",
      "Video",
   ];
   const formData = keys.reduce((acc, key) => {
      acc[key] = addresses[key] || []; // Set to empty array if key is not present in addresses
      return acc;
   }, {} as { [key: string]: string[] });

   const [isHovered, setIsHovered] = React.useState(false);

   const onSaveData = async () => {
      const finalObj = { formData: formData };

      try {
         const response = await axiosInstance.post(
            endPoints?.update_copyright,
            finalObj
         );
         if (response?.data?.success) {
            toast.success(`${response?.data?.message}`);
         }
      } catch (err) {
         toast.error("Error occurred while saving data!");
      }
   };

   return (
      <div className="bg-[#171717CC] p-10 mx-2 mt-16 rounded-xl">
         {UrlsPatterns?.map((url, index) => (
            <Accordion
               className="mt-5 !rounded-lg !bg-[#202020]"
               key={`${index} + ${url?.name}`}
            >
               <AccordionSummary
                  expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  className="!text-20px !text-white !font-semibold !bg-[#343434] !rounded-lg"
               >
                  {url?.name}
               </AccordionSummary>
               <AccordionDetails>
                  <div className="flex justify-between m-10">
                     <p className="flex items-center justify-center mr-8 text-white text-20px">
                        {url?.btnText}
                     </p>
                     <TextField
                        className="bg-white rounded-lg w-[70%]"
                        placeholder={url.placeHolderText}
                        value={inputValues[url.name] || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                           handleInputChange(e, url.name)
                        }
                     />
                  </div>
                  <div className="flex justify-end">
                     <Button
                        className="w-[180px] h-[44px] !bg-[#0714BD] !text-white !mx-10"
                        onClick={() => handleAddButtonClick(url.name)}
                     >
                        <FontAwesomeIcon
                           icon={faPlus}
                           className="w-8 text-xl cursor-pointer shrink-0"
                        />
                        Add
                     </Button>
                  </div>
                  {addresses[url.name]?.length > 0 && (
                     <div className="mx-10 mt-5 text-white">
                        {addresses[url.name].map((item, idx) => (
                           <p className="flex mb-3" key={`${idx} + ${item}`}>
                              {idx + 1} - {item}
                              <span onClick={() => removeUrl(url.name, item)}>
                                 <button className="mx-10 text-white">
                                    <FontAwesomeIcon
                                       icon={faMinus}
                                       className="p-1 text-base border border-red-600 rounded-full cursor-pointer"
                                    />
                                 </button>
                              </span>
                           </p>
                        ))}
                     </div>
                  )}
               </AccordionDetails>
            </Accordion>
         ))}
         <div className="flex items-center justify-end p-10">
            <p>
               For Video Clearance{" "}
               <span
                  style={{
                     textDecoration: "underline",
                     cursor: "pointer",
                     color: isHovered ? "#FB8A2E" : "initial",
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() => navigate('/contact')}
               >
                  Contact Us
               </span>
            </p>
            <Button
               className="!w-[120px] !h-[43px] !bg-[#FB8A2E] !text-white !font-semibold !ml-6"
               onClick={onSaveData}
            >
               Save
            </Button>
         </div>
      </div>
   );
};

export default AccordionComponent2;
