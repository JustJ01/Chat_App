import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import "./addUser.css"
import { database } from "../../../../lib/firebaseConfig";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {

  const [user,setUser] = useState(null);
  const [username, setUsername] = useState('');

  const {currentUser} = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const userRef = collection(database,"users");
      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q);

      if(!querySnapShot.empty){
        setUser(querySnapShot.docs[0].data());
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleAdd = async () => {
    const chatRef = collection(database,"chats");
    const userChatsRef = collection(database,"userchats");
    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef,{
        createdAt: serverTimestamp(),
        messages: [],
      })

      await updateDoc(doc(userChatsRef,user.id),{
        chats:arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        })
      })

      await updateDoc(doc(userChatsRef,currentUser.id),{
        chats:arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        })
      })
 
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="addUser">
      <form onSubmit={e=>handleSearch(e)}>
        <input type="text" placeholder="Username" name="username" onChange={e => setUsername(e.target.value)}/>
        <button>Search</button>
      </form>
      {user && <div className="user">
        <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
        </div>
        <button onClick={handleAdd}>Add User</button>
      </div>}
    </div>
  )
}

export default AddUser
