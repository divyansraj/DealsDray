import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Auth from "../src/components/Auth";
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <div>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<Auth />}></Route>
        <Route path="/home" element={<Home />}></Route>
      </Routes>
    </div>
  );
};

export default App;
