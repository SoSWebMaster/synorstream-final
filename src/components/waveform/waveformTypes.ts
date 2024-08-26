import { SongInterface } from '../song/songTypes';

export interface WaveFormProps {
    songId: number | string,
    audioUrl: string,
    play: boolean,
    isActive: boolean,
    mute?: boolean,
    setDuration: CallableFunction,
    afterSongLoaded?: CallableFunction,
    updateTime?: boolean,
    className?: string,
    nextSongFn?: CallableFunction,
    onSeek?: CallableFunction,
    updateCurrentSongOnActive?: null | any | SongInterface,
    nextSongOnFinish?: boolean,
    getInstance: Function,
    width?:string,
 }
 