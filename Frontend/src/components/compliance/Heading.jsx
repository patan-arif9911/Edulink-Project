
import BgRandomIcons from "./BgRandomIcons"
export default function Heading({title,subtitle}){




    return(
        <>
            <div className="relative mb-8 sm:mb-12 text-center animate-fadeDown ">
              
                {/* <BgRandomIcons /> */}
              
                        <h1 className="relative z-[1] text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                           {title}
                        </h1>
                        {/* <p className="relative z-[1] text-gray-600 text-base sm:text-lg">{subtitle}</p> */}
                 
            </div>
                
        </>
    )
}