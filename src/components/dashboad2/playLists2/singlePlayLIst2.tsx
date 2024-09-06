import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Songs from "../../song/Songs";
import { useAppSelector } from "../../../store";
import { useAppDispatch } from "../../../store";
import { updatePlayListFilter } from "../../../store/music-store";
import useAxios from "../../../services/axiosConfig/axiosConfig";
import { useEffect, useState } from "react";
import { SongInterface } from "../../song/songTypes";
import SongItem from "../../song/SongItem";
import axiosInstance from "../../../services/axiosConfig/axiosConfig";
import { endPoints } from "../../../services/constants/endPoint";
import DashboardComponent2 from "..";
import { useParams } from "react-router-dom";
import Player from "../../player/Player";

const perPage = 8;

const SinglePlayList2 = () => {
    const { id } = useParams();
    const { user } = useAppSelector((state) => state.auth);
    const { songType, filterCategories, search, playLists } = useAppSelector((state) => state.music);

    const [selectedPlaylist, setSelectedPlaylist] = useState<string | ''>('');
    const [songs, setSongs] = useState<SongInterface[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchingSong, setFetchingSong] = useState(false);
    const axios = axiosInstance();

    const dispatch = useAppDispatch();

    useEffect(() => {
        fetchSongs();
    }, [selectedPlaylist]); // Fetch songs whenever the selected playlist changes

    const fetchSongs = async () => {
        setIsLoading(true);
        setFetchingSong(true);
        try {
            const response = await axios.post(endPoints?.fetch_data2, {
                post: songType,
                page: 1,
                single_page: "playlist",
                categories: filterCategories.split(','),
                per_page: perPage,
                user: user?.id,
                search,
                page_name: id,
            });
            setSongs(response?.data?.records);
            setIsLoading(false);
            setFetchingSong(false);
        } catch (e) {
            console.error("Unable to fetch songs!!!", e);
            setIsLoading(false);
            setFetchingSong(false);
        }
    };

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const playlistName = event.target.value as string;
        setSelectedPlaylist(playlistName);
        dispatch(updatePlayListFilter(playlistName));
    };

    return (
        <>
            <DashboardComponent2>
                <div className="bg-[url('/static/images/Vector.png')] h-[280px] w-full bg-cover bg-center rounded-lg">
                    <div className="px-16 py-12 text-white">
                        <h1 className="text-[48px] font-medium">Playlists</h1>
                        <div className="w-3/4 px-4 py-2 mt-2 rounded-lg bg-black/50">
                            <p className="text-[20px] text-justify">
                                Discover your next favorite jam with our curated playlists! Dive into handpicked tracks
                                that suit every mood and moment. Explore, save, and share your personalized playlists
                                effortlessly. Let the music journey begin and elevate your vibe!
                            </p>
                        </div>
                    </div>
                    <Box sx={{ width: "100%" }} className="!flex !justify-end !my-10">
                        <FormControl className="!w-1/2 !flex !justify-end">
                            <InputLabel
                                sx={{
                                    color: "white",
                                    "&.Mui-focused": {
                                        color: "white", // Change label color to white when focused
                                    },
                                }}
                            >
                                Playlists
                            </InputLabel>
                            <Select
                                sx={{
                                    color: "white",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#FB8A2E",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#FB8A2E",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#FB8A2E",
                                    },
                                    "& .MuiSvgIcon-root": {
                                        color: "white", // Change chevron color to white
                                    },
                                }}
                                value={selectedPlaylist} // Controlled value
                                onChange={handleChange}
                                label="Playlists"
                            >
                                {playLists?.length > 0 &&
                                    playLists.map((item, index) => (
                                        <MenuItem
                                            key={`${index} + ${item?.name}`}
                                            value={item?.name} // Set value for MenuItem
                                        >
                                            {item?.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <div className="w-6/6">
                        {fetchingSong ? (
                            <CircularProgress color="warning" size={40} className="ml-4" />
                        ) : (
                            songs?.length > 0 ? (
                                songs.map((song, index) => (
                                    <SongItem key={song.id} {...song} />
                                ))
                            ) : (
                                <div>No Songs Found..</div>
                            )
                        )}
                    </div>
                </div>
                <Player />
            </DashboardComponent2>
        </>
    );
};

export default SinglePlayList2;