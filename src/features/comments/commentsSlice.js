// Import createAsyncThunk and createSlice here.
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Create loadCommentsForArticleId here.
export const loadCommentsForArticleId = createAsyncThunk(
  "comments/loadCommentsForArticleId",
  async (articleId) => {
    const response = await fetch(`api/articles/${articleId}/comments`);
    const json = response.json();
    return json;
  }
);

// Create postCommentForArticleId here.

const postCommentForArticleId = () => {};

export const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    // Add initial state properties here.
    byArticleId: {},
    isLoadingComments: false,
    failedToLoadComments: false,
  },
  // Add extraReducers here.
  extraReducers: (builder) => {
    builder
      .addCase(loadCommentsForArticleId.pending, (state) => {
        state.isLoadingComments = true;
        state.failedToLoadComments = false;
      })
      .addCase(loadCommentsForArticleId.fulfilled, (state, action) => {
        const { articleId, comments } = action.payload;
        state.byArticleId[articleId] = comments;
        state.isLoadingComments = false;
        state.failedToLoadComments = false;
      })
      .addCase(loadCommentsForArticleId.rejected, (state) => {
        state.failedToLoadComments = true;
        state.isLoadingComments = false;
      });
  },
});

export const selectComments = (state) => state.comments.byArticleId;
export const isLoadingComments = (state) => state.comments.isLoadingComments;
export const createCommentIsPending = (state) =>
  state.comments.createCommentIsPending;

export default commentsSlice.reducer;
