import {royalityItems,description,heading1,heading2} from './royalitySectionContent'
import Group from "/static/images/Group.png";
import GroupImages from '/static/images/Group-images.svg'

const RoyalitySection = () => {
   return (
      <>
         <div className="my-20">
            <div className=" bg-[url('/static/images/royality.png')] backdrop-blur bg-cover  bg-center !w-[100%] max-h-[550px] ">
               <div className="flex justify-between py-16 2xl:pl-60 xl:pl-40 lg:pl-20">
                  <div className="w-[50%]">
                     <p className="text-[40px] font-semibold mb-[-15px]">
                        {heading1}
                     </p>
                     <p className="text-[40px] font-semibold">{heading2}</p>
                     <p className="text-[16px] w-[80%]">{description}</p>
                     <div className="flex mt-4">
                        {royalityItems?.slice(0, 3)?.map((item, index) => (
                           <div className="flex mr-5" key={index}>
                              <img src={item?.src} />
                              <p className="text-[#FB8A2E] text-[28px] text-center">
                                 {item?.text}
                              </p>
                           </div>
                        ))}
                     </div>
                     <div className="flex mt-4">
                        {royalityItems?.slice(3, 5)?.map((item, index) => (
                           <div className="flex mr-5" key={index}>
                              <img src={item?.src} />
                              <p className="text-[#FB8A2E] text-[28px] text-center">
                                 {item?.text}
                              </p>
                           </div>
                        ))}
                     </div>
                     <div className="flex mt-4">
                        <img src={Group} />
                        <p className="text-[#FB8A2E] text-[28px] text-center">
                           And More
                        </p>
                     </div>
                  </div>
                  <div className="w-[50%] flex justify-end">
                     <img src={GroupImages} />
                     {/* {rectangleImages.map((row, rowIndex) => (
                        <div
                           className={`flex ${rowIndex > 0 ? "mt-5" : ""}`}
                           key={rowIndex}
                        >
                           {row.map((image, colIndex) => (
                              <img
                                 src={image}
                                 key={colIndex}
                                 className={`w-[${
                                    row.length === 3 ? "50%" : "40%"
                                 }] max-h-[135px] rounded-lg bg-cover ml-${
                                    colIndex === 0 ? "10" : "5"
                                 } overflow-hidden object-fill`}
                              />
                           ))}
                        </div>
                     ))} */}
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default RoyalitySection;
