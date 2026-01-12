import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getVideoLessonsByLetterAndLesson } from "../../API/videoLessons";

export const fetchVideoLesson = createAsyncThunk(
  "videoLessons/fetchVideoLesson",
  async (
    { letterId, lessonId }: { letterId: number; lessonId: number }
  ) => {
    const res = await getVideoLessonsByLetterAndLesson(letterId, lessonId);
    
    return res.data[0]; // أول فيديو
  }
);


interface VideoLessonState {
  video: any | null;
  loading: boolean;
}

const initialState: VideoLessonState = {
  video: null,
  loading: false,
};

const videoLessonsSlice = createSlice({
  name: "videoLessons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideoLesson.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVideoLesson.fulfilled, (state, action) => {
        state.video = action.payload;
        state.loading = false;
      })
      .addCase(fetchVideoLesson.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default videoLessonsSlice.reducer;
