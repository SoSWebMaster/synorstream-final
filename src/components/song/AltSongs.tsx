import axios from "axios";
import {
   useEffect,
   useState,
   useCallback,
   useId,
   Dispatch,
   SetStateAction,
} from "react";
import AltSong from "./AltSong";
import {
   ControlledAccordion,
   AccordionItem,
   useAccordionProvider,
} from "@szhsin/react-accordion";
import { useAppSelector } from "../../store";
const apiEndPoint = `${import.meta.env.VITE_SYNC_OR_STREAM_BASE_URL
   }/alt_songs_json`;

interface AltSongsProps {
   id: number | string;
   toggle: boolean | null;
   artis_name: string;
   thumb: string;
   isAccordionActive: Dispatch<SetStateAction<boolean>>;
}

export interface AltSongInterface {
   i_o2: number;
   id: number | string;
   name: string;
   artis_name: string;
   thumb: string;
   audio: string;
}

export default function AltSongs({
   id,
   // artis_name,
   // thumb,
   toggle,
   isAccordionActive,
}: AltSongsProps) {
   const accordionId = useId();
   const accordionProviderValue = useAccordionProvider({
      transition: true,
      transitionTimeout: 300,
   });

   const [songs, setSongs] = useState<AltSongInterface[]>([]);
   const [currentSongId, setCurrentSongId] = useState<number | null>(null);
   const [isAltPlaying, setIsAltPlaying] = useState(false);

   const handlePlayPause = (id: any) => {
      if (currentSongId === id) {
         setIsAltPlaying((prev) => {
            const newIsPlaying = !prev;
            return newIsPlaying;
         });
         // pauseSong()
         // dispatch(updateIsPlaying(false));
      } else {
         // Set new song and play
         setCurrentSongId(id);
         setIsAltPlaying(true);

         // dispatch(updateCurrentSongId(id));
         // dispatch(updateIsPlaying(false));
      }
   };

   const { isPlaying } = useAppSelector((state) => state.updatedMusicStore);

   const { toggle: accordionToggle } = accordionProviderValue;

   const fetchAltSongs = useCallback(async () => {
      try {
         const response = await axios.post(apiEndPoint, {
            id,
            post: 1,
            single: "syncorstream.com",
            user: 155,
         });

         const data = response.data.records;

         if (data && Array.isArray(data)) {
            data.map((song) => (song.id = `${id}_alt_${song.i_o2}`));

            setSongs(response.data.records);
         }
      } catch (e) {
         console.error("Unable to fetch alt songs", e);
      }
   }, [id]);

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
      // <div>
      <ControlledAccordion providerValue={accordionProviderValue}>
         <AccordionItem
            itemKey={accordionId}
            // @ts-ignore
            header={({ state }) => isAccordionActive(state.isEnter)}
            className="accordion-no-after-header"
         >
            {songs.map((song) => (
               <AltSong
                  key={song.id}
                  id={song.id}
                  name={song.name}
                  artis_name={song.artis_name}
                  thumb={song.thumb}
                  audio={song.audio}
                  isAltPlaying={isAltPlaying && currentSongId === song.id}
                  onPlayPause={() => handlePlayPause(song.id)}
                  isPlaying={isPlaying}
               />
            ))}
         </AccordionItem>
      </ControlledAccordion>
      // </div>
   );
}
