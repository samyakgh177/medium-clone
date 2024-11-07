import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export interface Blog {
    content: string;
    title: string;
    id: string;
    author: {
        name: string;
    };
}

export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token") || ""
            }
        })
        .then(response => {
            setBlog(response.data.blog);
            setLoading(false);
        })
        .catch(() => setLoading(false)); // Optional: Handle errors here
    }, [id]);

    return {
        loading,
        blog
    };
};

export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]); // Type blogs as an array of Blog objects

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
            headers: {
                Authorization: localStorage.getItem("token") || ""
            }
        })
        .then(response => {
            setBlogs(response.data.blogs); // Set blogs as an array
            setLoading(false);
        })
        .catch(() => setLoading(false)); // Optional: Handle errors here
    }, []);

    return {
        loading,
        blogs
    };
};
