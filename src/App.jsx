import { ProductiveCard } from "@carbon/ibm-products/lib/components";
import {
  Button,
  ButtonSkeleton,
  Column,
  FormGroup,
  Grid,
  SkeletonPlaceholder,
  TextInput,
  TextInputSkeleton,
} from "@carbon/react";
import { Add, Edit, TrashCan } from "@carbon/react/icons";
import { Text } from "@carbon/react/lib/components/Text";
import { useEffect, useState } from "react";
import Modal from "./components/Modal";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    paragraph: "",
  });
  const [isEdit, setIsEdit] = useState({
    id: "",
    mode: false,
    loading: false,
  });

  const handleCloseModal = () => {
    setIsEdit({
      id: "",
      mode: false,
      loading: false,
    });
    handleClearForm();
    setOpenModal(false);
  };

  const handleOpenModal = () => setOpenModal(true);

  const handleClearForm = () =>
    setForm({
      title: "",
      paragraph: "",
    });

  const handleChange = (e) => {
    setForm((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    setLoading(true);
    handleCloseModal();
    handleClearForm();
    if (isEdit.mode) {
      fetch(`http://localhost:3000/posts/${isEdit.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }).then(() => {
        handleGetPosts();
      });
    } else {
      fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }).then(() => {
        handleGetPosts();
      });
    }
    setIsEdit({
      mode: false,
      id: "",
      loading: false,
    });
  };

  const handleEdit = (id) => {
    setIsEdit({
      id,
      mode: true,
      loading: true,
    });
    handleGetPost(id);
    handleOpenModal();
  };

  const handleDelete = (id) => {
    setLoading(true);
    fetch(`http://localhost:3000/posts/${id}`, {
      method: "DELETE",
    }).then(() => {
      handleGetPosts();
    });
  };

  const handleGetPosts = (controller) => {
    fetch("http://localhost:3000/posts?_sort=id&_order=desc", {
      signal: controller?.signal,
    })
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .finally(() => setLoading(false));
  };

  const handleGetPost = (id) => {
    fetch(`http://localhost:3000/posts/${id}`)
      .then((res) => res.json())
      .then(({ title, paragraph }) => setForm({ title, paragraph }))
      .finally(() =>
        setIsEdit((state) => ({
          ...state,
          loading: false,
        }))
      );
  };

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    handleGetPosts(controller);

    return () => {
      controller.abort();
    };
  }, []);

  if (loading)
    return (
      <>
        <Grid fullWidth>
          <Column sm={4} md={2} lg={2}>
            <ButtonSkeleton />
          </Column>
        </Grid>
        <Grid fullWidth>
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <Column key={index} sm={4} md={4} lg={4}>
                <SkeletonPlaceholder className="card-placeholder" />
              </Column>
            ))}
        </Grid>
      </>
    );

  return (
    <>
      <Grid fullWidth>
        <Column sm={4} md={2} lg={2}>
          <Button
            renderIcon={Add}
            disabled={isEdit.mode}
            onClick={handleOpenModal}
          >
            Add
          </Button>
        </Column>
      </Grid>
      <Grid fullWidth>
        {posts.map((post) => (
          <Column key={post.id} sm={4} md={4} lg={4}>
            <ProductiveCard
              style={{
                height: "100%",
              }}
              actionIcons={[
                {
                  icon: Edit,
                  iconDescription: "Edit",
                  id: "1",
                  onClick: () => handleEdit(post.id),
                },
                {
                  icon: TrashCan,
                  iconDescription: "Delete",
                  id: "2",
                  onClick: () => handleDelete(post.id),
                },
              ]}
              onClick={function noRefCheck() {}}
              onKeyDown={function noRefCheck() {}}
              primaryButtonText="Details"
              title={post.title}
            >
              <Text>{post.paragraph}</Text>
            </ProductiveCard>
          </Column>
        ))}
        <Modal open={openModal} onClose={handleCloseModal}>
          <FormGroup legendId="form-group-1" legendText="FormGroup Legend">
            {isEdit.loading ? (
              <div>
                <TextInputSkeleton />
                <TextInputSkeleton />
                <ButtonSkeleton />
              </div>
            ) : (
              <div>
                <TextInput
                  id="Title"
                  labelText="Title"
                  value={form.title}
                  onChange={handleChange}
                  name="title"
                />
                <TextInput
                  id="Paragraph"
                  labelText="Paragraph"
                  value={form.paragraph}
                  onChange={handleChange}
                  name="paragraph"
                />
                <Button
                  type="submit"
                  style={{ marginTop: "1rem" }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
            )}
          </FormGroup>
        </Modal>
      </Grid>
    </>
  );
}

export default App;
