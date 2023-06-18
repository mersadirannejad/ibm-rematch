import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
    Heading,
    IconButton,
    Stack,
    ButtonSkeleton,
    SkeletonText,
} from '@carbon/react'
import { ChevronLeft } from '@carbon/react/icons'
import { Text } from "@carbon/react/lib/components/Text";

const PostDetail = () => {
    const params = useParams();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const detail = useSelector((store) => store.PostModel.detail);
    const loading = useSelector((store) => store.PostModel.loading);

    const handleChangeRoute = () => {
        navigate('/')
    }

    useEffect(() => {
        dispatch.PostModel.handleGetPostDetail({ id: params.id })
    }, []);

    if (loading) return (
        <Stack gap={6}>
            <ButtonSkeleton />
            <Heading>
                <SkeletonText />
            </Heading>
            <Text>
                <SkeletonText />
            </Text>
        </Stack>
    )

    return (
        <Stack gap={6}>
            <IconButton onClick={handleChangeRoute}>
                <ChevronLeft />
            </IconButton>
            <Heading>
                {detail.title}
            </Heading>
            <Text>
                {detail.paragraph}
            </Text>
        </Stack>
    );
};

export default PostDetail;