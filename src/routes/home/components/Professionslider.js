import { useEffect, useState} from "react";
import TextTransition, { presets } from 'react-text-transition';

const Prof = ["Doctor","Lawyer","Plumber"];

const Professionslider = () => {

  const [index,setIndex] = useState(0);

  useEffect(()=>{
    const intervalId = setInterval(
      ()=> setIndex((index)=>index+1),
      3000,
    );
    return () => clearTimeout(intervalId);
  },[])

  return (
    <div>
      <TextTransition className="prof" springConfig={presets.wobbly}>{Prof[index % Prof.length]}</TextTransition>
    </div>
  )
}

export default Professionslider