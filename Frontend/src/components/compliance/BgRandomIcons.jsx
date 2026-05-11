import { MdOutlinePreview,MdOutlineRateReview,MdCancel  } from "react-icons/md";
import { FaPenFancy } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { useEffect, useState } from "react";

export default function BgRandomIcons({min=10,max=20,minTextSize=110,maxTextSize=200}){
    const icons=[MdOutlinePreview,MdOutlineRateReview,MdCancel,FaPenFancy,TiTick]
    
     const [iconsData,setIconsData]=useState([]);
     const COLORS = [
     '#10b981',
      '#3b82f6',
     '#ef4444',
       '#f59e0b',
      '#2091b9',
       '#208ab4',
     '#5b98ad'
    ];
    
    function toRandomPosition(){
        const ran1=Math.floor(Math.random() * (max - min + 1)) + min;
        let tem=[];
        for(let i=0;i<ran1;i++){
            const x=Math.floor(Math.random() * (100 - 0 + 1)) + 0;
            const y=Math.floor(Math.random() * (100 - 0 + 1)) + 0;
            const i=Math.floor(Math.random() * (4 - 0 + 1)) + 0;
            const c=Math.floor(Math.random() * (7 - 0 + 1)) + 0;
            const s=Math.floor(Math.random() * (maxTextSize- minTextSize + 1)) + minTextSize;
    
            tem.push({'icon':icons[i],'color':COLORS[c],'x':x,'y':y,'size':s})
        }
        
        setIconsData(tem);
    }
    


    return(
        <>
            
                {
                    iconsData.length>0?(
                        iconsData.map((data,index)=>(
                            <data.icon key={index} 
                                style={{
                                color: data.color,
                                left: `${data.x}%`,
                                bottom: `${data.y}%`,
                                fontSize:`${data.size}%`,
                                }}
                            className='absolute  z-[0]' />
                            )
                    )):null
                }
            
        </>

    )
}