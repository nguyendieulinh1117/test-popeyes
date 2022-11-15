import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import Blog from "@@Blog";

import { homeActions } from "@redux/actions";

const BlogPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(homeActions.getListBlog({ type: 1, pageSize: 1000000 }));
    }, []);
    return <Blog />;
};

export default BlogPage;
