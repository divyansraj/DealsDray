import { useEffect } from "react";
import Employee from "../components/Employee";
import Navbar from "../components/Navbar";
// import SideBar from "../components/SideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setisLoggedin, setUser } from "../utils/AuthSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedin = useSelector((state) => state.authentication.isLoggedin);
  const token = localStorage.getItem("token") ;

  const getDetails = async () => {
    try {
      const response = {
        success: true,
      }
      //const response = await axios.post("http://localhost:4000/api/v1/user/details",{ token });
      if (response.data.success) {
        dispatch(setToken(response.data.token));
        dispatch(setisLoggedin(true));
        dispatch(setUser(response.data.user));
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (!isLoggedin && !token) {
      navigate("/");
      return;
    } else {
      getDetails();
    }
  }, [token, isLoggedin, navigate]);
  return (
    <>
      <Navbar />
       <Employee/>
    </>
  );
};

export default Home;
