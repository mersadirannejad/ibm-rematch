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
    detail: {
      id: "",
      title: "",
      paragraph: "",
    }
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
    setForm: (state, payload) => ({
      ...state,
      form: payload,
    }),
    setIsEdit: (state, payload) => ({
      ...state,
      isEdit: payload,
    }),
    setDetail: (state, payload) => ({
      ...state,
      detail: payload,
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
    async handleGetPostDetail({ id }) {
      dispatch.PostModel.setLoading(true);
      console.log(id)
      try {
        const res = await fetch(
          `http://localhost:3000/posts/${id}`
        );
        const data = await res.json();
        dispatch.PostModel.setDetail(data);
      } catch (e) {
        console.log(e);
      } finally {
        dispatch.PostModel.setLoading(false);
      }
    },
    async handleGetPost({ id, isEdit }) {
      try {
        const res = await fetch(`http://localhost:3000/posts/${id}`);
        const { title, paragraph } = await res.json();
        dispatch.PostModel.setForm({ title, paragraph });
      } catch (e) {
        console.log(e);
      } finally {
        dispatch.PostModel.setIsEdit({
          ...isEdit,
          loading: false,
        });
      }
    },
    async handleCreatePost({ form }) {
      try {
        await fetch("http://localhost:3000/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        dispatch.PostModel.handleGetPosts();
      } catch (e) {
        console.log(e);
      }
    },
    async handleEditPost({ form, isEdit }) {
      try {
        await fetch(`http://localhost:3000/posts/${isEdit.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        dispatch.PostModel.handleGetPosts();
      } catch (e) {
        console.log(e);
      }
    },
    async handleDeletePost({ id }) {
      try {
        dispatch.PostModel.setLoading(true);
        await fetch(`http://localhost:3000/posts/${id}`, {
          method: "DELETE",
        });
        dispatch.PostModel.handleGetPosts();
      } catch (e) {
        console.log(e);
      }
    },
  }),
});
