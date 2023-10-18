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
export const postCommentForArticleId = createAsyncThunk(
  "postCommentForArticleId",
  async ({ articleId, comment }) => {
    const requestBody = JSON.stringify({ comment: comment });
    const response = await fetch(`api/articles/${articleId}/comments`, {
      method: "POST",
      body: requestBody,
    });

    const json = await response.json();

    return json;
  }
);

export const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    // Add initial state properties here.
    byArticleId: {},
    isLoadingComments: false,
    failedToLoadComments: false,
    createCommentIsPending: false,
    failedToCreateComment: false,
  },
  // Add extraReducers here.
  extraReducers: (builder) => {
    builder
      //loadCommentsForArticleId
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
      })
      //postCommentsforArticleId
      .addCase(postCommentForArticleId.pending, (state) => {
        state.createCommentIsPending = true;
        state.failedToCreateComment = false;
      })
      .addCase(postCommentForArticleId.rejected, (state) => {
        state.createCommentIsPending = false;
        state.failedToCreateComment = true;
      })
      .addCase(postCommentForArticleId.fulfilled, (state, action) => {
        const { articleId } = action.payload;
        state.createCommentIsPending = false;
        state.failedToCreateComment = false;
        state.byArticleId[articleId].push(action.payload);
      });
  },
});

export const selectComments = (state) => state.comments.byArticleId;
export const isLoadingComments = (state) => state.comments.isLoadingComments;
export const createCommentIsPending = (state) =>
  state.comments.createCommentIsPending;

export default commentsSlice.reducer;
