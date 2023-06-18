import { createModel } from "@rematch/core";

export const PostModel = createModel({
  state: {
    posts: [],
    loading: true,
    openModal: false,
    form: {
      title: "",
      paragraph: "",
    },
    isEdit: {
      id: "",
      mode: false,
      loading: false,
    },
  },
  reducers: {
    setPosts: (state, payload) => ({
      ...state,
      posts: payload,
    }),
  },
  
});
