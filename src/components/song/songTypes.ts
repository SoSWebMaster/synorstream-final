export interface SongInterface {
    id: number | string,
    name: string,
    artis_name: string,
    thumb: string,
    audio: string,
    flt_name?: string[],
    alt_yes_n?: number,
 }
 export interface SongInterface3 {
   id: number | string,
   name: string,
   artis_name: string,
   thu: string,
   audio_mp3: string,
   flt_name?: string[],
   alt_yes_n?: number,
}

 export interface SongInterface2 {
    id?: number | string,
    name?: string,
    artis_name?: string,
    thumb?: string,
    audio?: string | string[] | any,
    flt_name?: string[],
    alt_yes_n?: number,
    swiperRef? :  any
 }
