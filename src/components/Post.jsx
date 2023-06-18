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
import { useEffect } from "react";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Post() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const posts = useSelector((store) => store.PostModel.posts);
    const loading = useSelector((store) => store.PostModel.loading);
    const openModal = useSelector((store) => store.PostModel.openModal);
    const form = useSelector((store) => store.PostModel.form);
    const isEdit = useSelector((store) => store.PostModel.isEdit);

    const handleCloseModal = () => {
        handleClearIsEdit();
        handleClearForm();
        dispatch.PostModel.setOpenModal(false);
    };

    const handleOpenModal = () => dispatch.PostModel.setOpenModal(true);

    const handleClearForm = () =>
        dispatch.PostModel.setForm({
            title: "",
            paragraph: "",
        });

    const handleClearIsEdit = () =>
        dispatch.PostModel.setIsEdit({
            id: "",
            mode: false,
            loading: false,
        });

    const handleChange = (e) => {
        dispatch.PostModel.setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        dispatch.PostModel.setLoading(true);
        handleCloseModal();
        handleClearForm();
        if (isEdit.mode) {
            dispatch.PostModel.handleEditPost({ form, isEdit })
        } else {
            dispatch.PostModel.handleCreatePost({ form })
        }
        handleClearIsEdit();
    };

    const handleEdit = (id) => {
        dispatch.PostModel.setIsEdit({
            id,
            mode: true,
            loading: true,
        });
        dispatch.PostModel.handleGetPost({ id, isEdit })
        handleOpenModal();
    };

    const handleDelete = (id) => dispatch.PostModel.handleDeletePost({ id })

    const handleChangeRoute = (id) => {
        navigate(`/posts/${id}`)
    }

    useEffect(() => {
        dispatch.PostModel.setLoading(true);
        dispatch.PostModel.handleGetPosts();
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
                    {Array(30)
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
                            onPrimaryButtonClick={() => handleChangeRoute(post.id)}
                            onKeyDown={function noRefCheck() { }}
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

export default Post;
