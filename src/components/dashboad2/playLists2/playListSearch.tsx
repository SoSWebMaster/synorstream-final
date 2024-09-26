//@ts-nocheck

import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const PlayListSearch = ({ searchQuery, setSearchQuery }) => {
   return (
      <div className={`border  !border-custom-gradient-start my-10 relative rounded-md   overflow-hidden text-lg`}>
         <input
            className="block w-full py-2 pl-4 font-semibold !text-white  pr-11 h-11 focus:outline-none"
            type="text"
            value={searchQuery}
            placeholder="Search Here"
            onChange={(event) => setSearchQuery(event.target.value)}
         />
         <button className="absolute top-0 bottom-0 right-0 h-full text-white aspect-square">
            <FontAwesomeIcon icon={faSearch} />
         </button>
      </div>
   )
}

export default PlayListSearch
