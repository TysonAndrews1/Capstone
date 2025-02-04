import React,{useState} from "react";

//Created By Tyson
//The Create announcmnet Page dedicated to creating announcments to be sent to the rest of the crew

export default function CreateAnnouncement(){

    const [announcemntTitle, setAnnouncemntTitle] = useState("")
    const [announcemntBody, setAnnouncemntBody] = useState("")

    const handleSave = async () =>{
        const Announcment = {
            title: announcemntTitle,
            body: announcemntBody
        }
        console.log(Announcment);
        
        
        
    }



return (

    <div>
        <label>Title: </label>
    <input type="text" className = "input-field mb-5 w-full" placeholder="title" value={announcemntTitle} onChange={(e)=>setAnnouncemntTitle(e.target.value)}/>
    <label>Announcment Body</label>
    <textarea type="text" className = "input-field w-full h-20"placeholder="body" value={announcemntBody} onChange={(e)=>setAnnouncemntBody(e.target.value)}/>
        <button className= "basic-button" onClick={handleSave}>
            Save
        </button>
    </div>
)}