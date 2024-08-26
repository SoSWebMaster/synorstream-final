import { useState, useCallback } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import Modal from '../../util/Modal';
import { endPoints } from '../../services/constants/endPoint';
import axiosInstance from '../../services/axiosConfig/axiosConfigSimple';

interface SongInfoProps {
   songId: number | string |any,
}

interface InfoType {
   __html: string
}

export default function SongInfo( { songId }: SongInfoProps ) {
   const [isModalActive, setIsModalActive] = useState( false );
   const [info, setInfo] = useState<null | InfoType>( null );

   const fetchSongInfo = useCallback( async () => {
      if( info )  {
         setIsModalActive( true );
         return
      }

      try{
         const response = await axiosInstance.post( `${endPoints.info_record}`, {
            id: songId
         });

         const result = response;
         setIsModalActive( true );
         if( result?.data?.html )  {
            setInfo( { __html: result.data.html } );
         }
      } catch( e )  {
         console.error( "something went wrong while fetching song info", e );
      }
   }, [info, songId]);

   return (
      <>
         <FontAwesomeIcon
            className="cursor-pointer"
            icon={faInfoCircle}
            onClick={() => fetchSongInfo()}
         />
         {isModalActive &&
            <Modal
               active={isModalActive}
               onClose={() => {
                  setIsModalActive( false );
               }}
            >
               {info &&
                  <div className="relative m-3 md:m-0">
                     <button
                        className="absolute top-0 right-0 flex items-center justify-center w-6 text-lg text-black translate-x-1/2 -translate-y-1/2 bg-white rounded-full md:w-10 aspect-square md:text-xl"
                        onClick={() => setIsModalActive( false )}
                     >
                        <FontAwesomeIcon
                           icon={faXmark}
                        />
                     </button>
                     <ul
                        dangerouslySetInnerHTML={info}
                        className="p-5 space-y-3 text-center list-none rounded song-info bg-zinc-700 md:px-12 md:py-8 md:space-y-5"
                     />
                  </div>
               }
            </Modal>
         }
      </>
   )
}
