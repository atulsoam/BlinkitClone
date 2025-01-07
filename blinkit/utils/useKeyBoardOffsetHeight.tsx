import { View, Text, Keyboard } from "react-native";
import React, { useEffect, useState } from "react";

const UseKeyBoardOffsetHeight = () => {
  const [KeyBoardOffsetHeight, setKeyboardOffsetheight] = useState(0);
  
  useEffect(()=>{
    const AndroidShow =  Keyboard.addListener("keyboardDidShow",e=>{
        setKeyboardOffsetheight(e.endCoordinates.height)
    })
    const AndroidHide =  Keyboard.addListener("keyboardDidHide",e=>{
        setKeyboardOffsetheight(0)
    })
    const IOSShow =  Keyboard.addListener("keyboardWillShow",e=>{
        setKeyboardOffsetheight(e.endCoordinates.height)
    })
    const IOSHide =  Keyboard.addListener("keyboardWillHide",e=>{
        setKeyboardOffsetheight(0)
    })

    return ()=>{
        AndroidHide.remove()
        AndroidShow.remove()
        IOSHide.remove()
        IOSShow.remove()
    }

  },[])
  
  return KeyBoardOffsetHeight;
};

export default UseKeyBoardOffsetHeight;
