import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { app, database } from "../../lib/firebaseConfig.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { upload } from "../../lib/upload.js";

const Login = () => {

    const auth = getAuth();

    const [data, setData] = useState({});
    const [newdata, setNewData] = useState({});
    const [loading, setLoading] = useState(false);

    const [avatar, setAvatar] = useState({
        file:null,
        url:""
    });

    const handleInput = (e)=>{
      const newInput = { [e.target.name]: e.target.value};
      setData({...data, ...newInput});
    }

    const handleNewInput = (e)=> {
      const Input = { [e.target.name]: e.target.value};
      setNewData({...newdata, ...Input});
    }

    const handleAvatar = (e) =>{
        if(e.target.files[0]){
            setAvatar({
                file:e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    }

    const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast.success("Logged In");
        setData({})
      } catch (error) {
        toast.error(error.message)
      } finally{
        setLoading(false);
      }
    }

    const handleNewAccount = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      try {
          const response = await createUserWithEmailAndPassword(auth, newdata.email, newdata.password);
          
          const avatarURL = await upload(avatar.file);

          await setDoc(doc(database,"users", response.user.uid), {
            username: newdata.username,
            email: newdata.email,
            id: response.user.uid,
            avatar: avatarURL,
            blocked: []
          });

          await setDoc(doc(database,"userchats",response.user.uid), {
            chats: []
          });

          toast.success("User Created");

          setNewData({});
          setAvatar({
              file: null,
              url: ""
          });
      } catch (err) {
          toast.error(err.message);
      } finally{
        setLoading(false)
      }
  };

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={e=>handleLogin(e)}>
            <input type="text" placeholder="Email" name="email" value={data.email || ""} onChange={e => handleInput(e)}/>
            <input type="password" placeholder="Password" name="password" value={data.password || ""} onChange={e => handleInput(e)}/>
            <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
      <h2>Create an Account</h2>
        <form onSubmit={e=>handleNewAccount(e)}>
            <div className="file-upload">
            <img src={avatar.url || "./avatar.png"} alt="" />
            <label htmlFor="file">
                <svg aria-hidden="true" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path strokeWidth="2" stroke="#ffffff" d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125" strokeLinejoin="round" strokeLinecap="round"></path>
                    <path strokeLinejoin="round" strokeWidth="2" stroke="#ffffff" d="M17 15V18M17 21V18M17 18H14M17 18H20"></path>
                </svg>
            ADD FILE
            </label>
            </div>
            <input type="file" id="file" style={{display: "none"}} onChange={handleAvatar}/>
            <input type="text" placeholder="Username" name="username" value={newdata.username || ""} onChange={e => handleNewInput(e)}/>
            <input type="text" placeholder="Email" name="email" value={newdata.email || ""} onChange={e => handleNewInput(e)}/>
            <input type="password" placeholder="Password" name="password" value={newdata.password || ""} onChange={e => handleNewInput(e)}/>
            <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
        </form>
      </div>
    </div>
  )
}

export default Login
