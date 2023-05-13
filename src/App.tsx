import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import MyVideoConverter from "./MyVideoConverter";
import Ffmpeg from "./components/Ffmpeg";
import Form from "./components/Form";
import FfmpegFormStyled from "./components/FfmpegFormStyled";
import FfmpegFormStyledWithUtilsCustomCommand from "./components/FfmpegFormStyledWithUtilsCustomCommand";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <FfmpegFormStyledWithUtilsCustomCommand />
    </div>
  );
}

export default App;
