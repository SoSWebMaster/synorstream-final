import { useCallback, useRef } from "react";
import { updateFilterCategories } from "../../store/updated-music-store";
import SongSwitcher from "./SongSwitcher";
import CategoryFilter from "./CategoryFilter";
import musicFilterInfo from "../../util/music-filter-info";
import sfxFilterInfo from "../../util/sfx-filer-info";
import { useAppDispatch, useAppSelector } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Logo from '/static/images/SoS_Logo.png'
import Search from "./Search";
import { Divider } from "@mui/material";

interface FilterProps {
   className?: string,
}

export default function Filter({ className }: FilterProps) {
   const { songType } = useAppSelector(state => state.music);
   const dispatch = useAppDispatch();
   const filterRef = useRef<HTMLDivElement>(null);
   const categoryRef = useRef<HTMLDivElement>(null);
   const handleOnChange = () => {
      if (!categoryRef.current) return
      // const categoryCheckboxes = categoryRef?.current.querySelectorAll( "input[type='checkbox']" );
   }
   const updatefilterhandler = useCallback(() => {
      if (!categoryRef.current) return

      const categoryCheckboxes = categoryRef.current.querySelectorAll("input[type='checkbox']");

      const checkedBoxes: string[] = [];

      categoryCheckboxes.forEach(cat => {
         const checkbox = cat as HTMLInputElement;

         if (checkbox.checked) checkedBoxes.push(checkbox.value);
      });

      dispatch(updateFilterCategories(checkedBoxes.toString()));
   }, [categoryRef]);

   return (
      <div className={`${className ? className + ' ' : ''}space-y-3`}>
         <div className="flex justify-center text-center">
            <img src={Logo} />
         </div>
         <Divider className="!bg-[#555555] !my-5 w-[100%]" />
         <div className="flex gap-3 md:block">
            <h1 className="mb-5 !text-[16px] !font-semibold">Search</h1>
            <button
               className="md:!hidden py-1 px-3 border border-white/20 rounded shrink-0"
               onClick={() => {
                  if (!filterRef.current) return

                  filterRef.current.classList.toggle('!hidden');
               }}
            >
               <FontAwesomeIcon icon={faBars} />
            </button>
            <Search className="grow" />
         </div>
         <div className="relative">
            <div className="space-y-3 !hidden md:!block bg-[#131313] md:bg-transparent p-3 md:p-0" ref={filterRef}>
               <SongSwitcher title={'FILTER BY'} />
               <div ref={categoryRef} onChange={handleOnChange} className="max-h-[240px] overflow-y-auto scrollbar-hide">
                  { /* @ts-ignore */}
                  {songType === 0 && <CategoryFilter categories={musicFilterInfo} />}
                  { /* @ts-ignore */}
                  {songType === 1 && <CategoryFilter categories={sfxFilterInfo} />}
               </div>
               <button
                  className="w-full px-3 py-2 font-normal rounded-md bg-primary-blue md:px-5 h-[54px]"
                  onClick={updatefilterhandler}
               >
                  UPDATE SEARCH
               </button>
            </div>
         </div>
      </div>
   )
}