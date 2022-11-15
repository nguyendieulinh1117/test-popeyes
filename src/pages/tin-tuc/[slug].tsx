import React, { useEffect } from "react";

import BlogDetail from "@@Blog/BlogDetail";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { homeActions } from "@redux/actions";

const BlogPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { slug } = router.query;
    useEffect(() => {
        dispatch(homeActions.getListBlog({ type: 1, pageSize: 1000000 }));
        if (slug) {
            dispatch(homeActions.getBlogDetail(slug));
        }
    }, [slug]);
    return <BlogDetail />;
};

export default BlogPage;
