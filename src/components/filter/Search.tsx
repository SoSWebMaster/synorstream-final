import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {  updateSearch } from "../../store/music-store";
import { debounce } from "../../util/util";
import { useAppDispatch } from "../../store";
interface SearchProps{
   className?: string,
}

export default function Search( { className }: SearchProps ) {
   const dispatch = useAppDispatch();
   // @ts-ignore
   const updateSearchTerms = debounce( ( e: Event ) => dispatch( updateSearch( e.target?.value ) ), 500 );

   return(
      <div className={`${className ? className + ' ' : ''}relative rounded-md   overflow-hidden text-lg`}>
         <input
            className="block w-full py-2 pl-4 font-semibold !text-white  pr-11 h-11 focus:outline-none"
            type="text"
            placeholder="Search Here"
            onChange={updateSearchTerms}
         />
         <button className="absolute top-0 bottom-0 right-0 h-full text-white aspect-square">
            <FontAwesomeIcon icon={faSearch} />
         </button>
      </div>
   )
}
