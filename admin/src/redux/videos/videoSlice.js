import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  video: [],
};

export const VideoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideo: (state, action) => {
      state.video = action.payload;
    },
    addVideo: (state, action) => {
      state.video.unshift(action.payload);
    },
    updateVideo: (state, action) => {
      const index = state.video.findIndex(
        (video) => video.id === action.payload.id
      );
      if (index !== -1) {
        state.video[index] = action.payload;
      }
    },
    deleteVideo: (state, action) => {
      state.video = state.video.filter(
        (video) => video.video_id !== action.payload
      );
    },
  },
});

export const { setVideo, addVideo, updateVideo, deleteVideo } =
  VideoSlice.actions;

export default VideoSlice.reducer;
