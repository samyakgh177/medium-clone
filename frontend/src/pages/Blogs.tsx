import { BlogCard } from "../components/BlogCard"
import { Appbar } from "../components/Appbar"
import { useBlogs } from "../Hooks"
import { BlogSkeleton } from "../components/BlogSkeleton";
export const Blogs = () => {
    //create our own custom hook called useBlogs

    const { loading, blogs } = useBlogs();

    if (loading ) {
        return <div>
            <Appbar />
            <div className="flex justify-center">

                <div>
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                </div>
            </div>
        </div>
    }

    
    return (
        <div >
            <Appbar />
            <div className="flex justify-center">

                <div>
                    {blogs.map(blog => <BlogCard
                        id={blog.id}
                        authorName={blog.author.name || "Anonymous"}
                        title={blog.title}
                        content={blog.content}
                        publishedDate={"2nd Feb 2024"}

                    />
                    )}

                </div>
            </div>

        </div>


    )
}