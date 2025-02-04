import React,{useState} from "react";
import { useNavigate } from "react-router-dom";

//Created By Tyson
//The Home Page dedicated to future navigation of the page 

export default function CreateAnnouncement(){

    const [announcemntTitle, setAnnouncemntTitle] = useState("")
    const [announcemntBody, setAnnouncemntBody] = useState("")

    const handleSave = async () =>{
        console.log(announcemntTitle, announcemntBody);
        
        
    }



return (

    <div>
    <input type="text" className = "input-field" placeholder="title" value={announcemntTitle} onChange={(e)=>setAnnouncemntTitle(e.target.value)}/>
    <textarea type="text" className = "input-field"placeholder="body" value={announcemntBody} onChange={(e)=>setAnnouncemntBody(e.target.value)}/>
        <button className= "basic-button" onClick={handleSave}>
            Save
        </button>
    </div>
)
}