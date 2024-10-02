import {
   useEffect,
   useState,
   useCallback,
   useId,
   Dispatch,
   SetStateAction,
} from "react";
// import AltSong from "./AltSong";
import {
   ControlledAccordion,
   AccordionItem,
   useAccordionProvider,
} from "@szhsin/react-accordion";
import {
   // nextSong,
   updateCurrentSongId,
   updateIsPlaying,
} from "../../store/music-store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../store";
import axiosInstance from "../../services/axiosConfig/axiosConfigSimple";
import { endPoints } from "../../services/constants/endPoint";
import SimilarSong from "./SimilarSong";
// const apiEndPoint = `${
//    import.meta.env.VITE_SYNC_OR_STREAM_BASE_URL
// }/alt_songs_json`;

interface AltSongsProps {
   id: number | string;
   toggle: boolean | null;
   artis_name: string;
   thumb: string;
   isAccordionActive: Dispatch<SetStateAction<boolean>>;
   name: string
}

export interface AltSongInterface {
   i_o2: number;
   id: number | string;
   name: string;
   artis_name: string;
   thumb: string;
   audmp: string;
}

export default function SimilarSongs({
   id,
   // artis_name,
   // thumb,
   toggle,
   // isAccordionActive,
   name
}: AltSongsProps) {
   const accordionId = useId();
   const accordionProviderValue = useAccordionProvider({
      transition: true,
      transitionTimeout: 300,
   });

   const [songs, setSongs] = useState<AltSongInterface[]>([]);
   const [currentSongId, setCurrentSongId] = useState<number | null>(null);
   const [isAltPlaying, setIsAltPlaying] = useState(false);
   const dispatch = useAppDispatch();

   const handlePlayPause = (id: any) => {
      if (currentSongId === id) {
         setIsAltPlaying((prev) => {
            const newIsPlaying = !prev;
            return newIsPlaying;
         });
         dispatch(updateIsPlaying(false));
      } else {
         // Set new song and play
         setCurrentSongId(id);
         setIsAltPlaying(true);
         dispatch(updateCurrentSongId(id));
         dispatch(updateIsPlaying(false));
      }
   };

   const { isPlaying } = useAppSelector((state) => state.music);

   const { toggle: accordionToggle } = accordionProviderValue;

   const fetchAltSongs = useCallback(async () => {
      try {
         const response = await axiosInstance.post(endPoints?.sim_song, {
            id,
            post: 1,
            single: 'syncorstream.com',
            // per_page: 10,
            // user: 155,
            page: 1,
            // source:'react'
         });

         const data = response.data.data;
         setSongs(data)

         // if( data && Array.isArray( data ) ) {
         //    data.map( song => song.id = `${id}_sim_${song.id}` );

         //    setSongs( response.data.records );
         // }

      } catch (e) {
         console.error('Unable to fetch alt songs', e);
      }
   }, [id]);

   // const nextAltSong = useCallback(
   //    (currentId: string) => {
   //       const currentIndex = songs.findIndex((song) => song.id === currentId);
   //       const nextAltSong = songs[currentIndex + 1];

   //       if (currentIndex !== -1 && nextAltSong) {
   //          dispatch(updateCurrentSongId(nextAltSong.id));
   //       } else {
   //          dispatch(nextSong());
   //       }
   //    },
   //    [songs, currentSongId]
   // );

   useEffect(() => {
      if (toggle === null) return;

      if (songs.length === 0) {
         fetchAltSongs();
      } else if (songs.length > 0) {
         accordionToggle(accordionId);
      }
   }, [toggle]);

   useEffect(() => {
      if (songs.length > 0) {
         accordionToggle(accordionId);
      }
   }, [songs]);

   useEffect(() => {
      if (isPlaying) {
         setIsAltPlaying(false);
      }
   }, [isPlaying]);

   return (
      <div>
         <ControlledAccordion providerValue={accordionProviderValue}>
            <AccordionItem
               itemKey={accordionId}
               // @ts-ignore
               header={({ state }) => { }}
               className="accordion-no-after-header"
            >
               <div className="flex items-center justify-between">
                  <p className="my-2 text-base font-semibold md:mt-3 md:text-lg">Similar songs to {name}</p>
                  <button
                     onClick={() => accordionToggle(accordionId)}
                  >
                     <FontAwesomeIcon
                        icon={faXmark}
                     />
                  </button>
               </div>
               {songs.map((song) => (
                  <SimilarSong
                     key={song.id}
                     id={song.id}
                     name={song.name}
                     artis_name={song.artis_name}
                     thumb={song.thumb}
                     audio={song.audmp}
                     isAltPlaying={isAltPlaying && currentSongId === song.id}
                     onPlayPause={() => handlePlayPause(song.id)}
                     isPlaying={isPlaying}
                  />
               ))}
            </AccordionItem>
         </ControlledAccordion>
      </div>
   );
}
