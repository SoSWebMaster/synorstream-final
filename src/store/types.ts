export type authSlicetype = {
    user: userTypes,
    error?: string | string[] | null | unknown,
    loading: boolean,
    success?: boolean,
    redirect?:boolean
    result?:boolean,

    link?:string,
    token?:string
  }

export type userTypes={
    id?: string,
    name?:string,
    email?: string,
    access_token?:string
}

export interface PlayListTypes {
  id?: number;
  user_id?: number;
  name?: string;
  tcount?: number;
  song_id?: number; // Assuming song_id is part of PlayListTypes
}