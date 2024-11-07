import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SingnupInput } from "@asmyaaak17/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";


export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SingnupInput>({
        name: "",
        email: "",
        password: ""
    });


    async function sendRequest(){
        try{
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type==="signup"?"signup":"signin"}`,postInputs)
            const jwt = response.data;
            const jwtResponse = jwt.jwt;
            localStorage.setItem("token", jwtResponse);
            navigate("/blogs");
    
        }catch(e){
            alert("Error while signing on")

        }
    }

    

    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="px-16">
                    <div className="text-3xl font-extrabold">
                        {type==="signin"?"Don't have an account" : "Create an Account"}
                    </div>
                    <div className="text-slate-400">
                        Already have an account?
                        <Link className="pl-2 underline" to={type==="signin"?"/signup":"/signin"}>
                        {type==="signin"?"Sign in" : "Sign up"}
                        </Link>
                    </div>
                </div>
                

                <div className="pt-8">
                     {type==="signup"? <LabelledInput label="Name" placeholder="Samyak" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            name: e.target.value
                        })
                    }} /> :null}
                    <LabelledInput label="Email" placeholder="Samyak2@gmail.com" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            email: e.target.value
                        })
                    }} />
                    <LabelledInput label="Password" type={"password"} placeholder="password" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        })
                    }} />
                    <button onClick={sendRequest} type="button" className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup"? "Sign up": "Sign in"}</button>

                </div>

            </div>
        </div>


    </div>
}


interface LabelledInputTypes {
    label: string,
    placeholder: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputTypes) {
    return (
        <div>
            <label className="block mb-2 text-sm text-black font-semibold pt-3">{label}</label>
            <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
        </div>
    )
}