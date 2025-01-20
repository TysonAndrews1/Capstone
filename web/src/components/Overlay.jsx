import React,{useState} from "react";



export default function Overlay({child, headerTitle,ButtonTitle, buttonPlacement}){
    //Slightly weird variable due to the sidebar being on the right side of the screen the true/False are reversed
    const [isClosed, setIsClosed]= useState(true)


    function closeOverlay(){
        setIsClosed(true)
    }
    
    const toggleSidebar = () => setIsClosed(!isClosed);

    return(
    

        <div>
        <button
          onClick={toggleSidebar}
          className={`fixed px-4 py-2 w-48 bg-main-blue text-white font-bold rounded hover:bg-hover-bluetransition ${buttonPlacement}`}
        >
          {ButtonTitle}
        </button>

        {/* SideBar */}
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-gray-800 transform ${
            isClosed ? "translate-x-full" : "-translate-x-0"
          } transition-transform duration-300`}
        >
            <header className="bg-hover-blue text-white py-4 px-6 flex items-center">
       <button
        className="block p-2"
        onClick={closeOverlay}
        aria-label="Toggle Menu"
      >
        <span className="block w-6 h-1 bg-white mb-1"></span>
        <span className="block w-6 h-1 bg-white mb-1"></span>
        <span className="block w-6 h-1 bg-white "></span>
      </button>
        <h1 className="text-2xl font-bold ml-4">{headerTitle}</h1> 
      </header>
        {child}
        </div>
      </div>
)
}