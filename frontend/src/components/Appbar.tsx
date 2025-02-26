import { Link } from "react-router-dom"
import { Avatar } from "./BlogCard"

export const Appbar = () => {
    return <div className="border-b px-10 flex justify-between py-4">
        <Link to={'/blogs'} className="flex flex-col justify-center font-semibold cursor-pointer">
            Medium
        </Link>
        
        <div>
            <Link to={`/publish`}>
            
            
                <button type="button" className="mr-4 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 ">New</button>
            </Link>
            <Avatar name="Sas" size="big" />
        </div>

    </div>
}