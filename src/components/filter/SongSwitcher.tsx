import { useId, ChangeEvent } from "react";
import { updateMusicType, updateSongType } from "../../store/music-store";
import { useAppDispatch } from "../../store";
import Music from '/static/images/mdi_music.png'
import Volume from '/static/images/Vector (3).png'

interface SongSwitcherProps {
   title: string,
}

export default function SongSwitcher( { title }: SongSwitcherProps ) {
   const musicBtnId = useId();
   const sfxBtnId = useId();
   const radioId = useId();
   const dispatch = useAppDispatch();
   const changeSongTypeHandler = (e: ChangeEvent<HTMLInputElement>  ) => {
       const value = +e.currentTarget.value;
      
      
      if( value === 0 ){
         dispatch( updateSongType( value ) );
         dispatch(updateMusicType('music'))
      
      }
      else{
         dispatch(updateSongType( value ) );
         dispatch(updateMusicType('sfx'))
      }
   };

   return (
      <div>
         <p className="mb-2 text-lg font-semibold md:mb-3">{title}</p>
         <div className="flex overflow-hidden text-center ">
            <div className="flex-1 ">
               <input
                  className="hidden"
                  id={musicBtnId}
                  type="radio"
                  value="0"
                  name={radioId}
                  onClick={(e : any)=>{changeSongTypeHandler(e)}}
                  defaultChecked={true}
               />
               <label
                  className="block p-2.5 font-semibold cursor-pointer !bg-[#0714BD] rounded-lg  md:flex md:justify-center"
                  htmlFor={musicBtnId}
               > <span><img src={Music} className="mr-2"/> </span>  MUSIC
               </label>
            </div>
            <div className="flex-1 ">
               <input
                  className="hidden"
                  id={sfxBtnId}
                  type="radio"
                  value="1"
                  name={radioId}
                  onClick={(e : any)=>{changeSongTypeHandler(e)}}
               />
               <label
                  className="block p-2.5 font-semibold cursor-pointer border border-[#999999] rounded-lg ml-2 text-[#999999]  md:flex md:justify-center"
                  htmlFor={sfxBtnId}
               > <span><img src={Volume} className="mr-2"/> </span> SFX
               </label>
            </div>
         </div>
      </div>
   )
}
