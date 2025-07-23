import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;


export const fetchInstaVideoData = async (url) => {
    try {
        const { data } = await axios.get(`${API_URL}/api/download/insta-media?url=${url}`);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const fetchYoutubeVideoData = async (url) => {
    try {
        const { data } = await axios.get(`${API_URL}/api/download/yt-media?url=${url}`);
        return data;
    } catch (error) {
        console.log(error);
    }
}   