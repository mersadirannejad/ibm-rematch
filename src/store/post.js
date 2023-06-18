import { createModel } from "@rematch/core";

export const PostModel = createModel()({
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
    setLoading: (state, payload) => ({
      ...state,
      loading: payload,
    }),
    setOpenModal: (state, payload) => ({
      ...state,
      openModal: payload,
    }),
  },
  effects: (dispatch) => ({
    async handleGetPosts() {
      try {
        const res = await fetch(
          "http://localhost:3000/posts?_sort=id&_order=desc"
        );
        const data = await res.json();
        dispatch.PostModel.setPosts(data);
      } catch (e) {
        console.log(e);
      } finally {
        dispatch.PostModel.setLoading(false);
      }
    },
  }),
});
