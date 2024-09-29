import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import "./detail.css";
import { getAuth } from "firebase/auth";
import { database } from "../../lib/firebaseConfig";
import { useEffect, useState } from "react";

const Detail = () => {

  const auth = getAuth();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
  const { currentUser } = useUserStore();
  const [sharedPhotos, setSharedPhotos] = useState([]); 


  const handleBlock = async ()=>{
    if(!user) return;

    const userDocRef = doc(database,"users",currentUser.id);

    try {
      await updateDoc(userDocRef,{
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
      });
      changeBlock(user.id);
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(doc(database, "chats", chatId), (res) => {
        const chatData = res.data();
        if (chatData && chatData.messages) {
          const photos = chatData.messages
            .filter((message) => message.img)
            .map((message) => message.img);
          setSharedPhotos(photos);
        }
      });
      return () => {
        unSub();
      };
    }
  }, [chatId]);

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option sharedphotos">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            {sharedPhotos.length > 0 ? (
              sharedPhotos.map((photo, index) => (
                <div className="photoItem" key={index}>
                  <div className="photoDetail">
                    <img src={photo} alt={`Shared Photo ${index}`} />
                    <span>{`photo_${index + 1}.png`}</span>
                  </div>
                  <img src="./download.png" className="icon" alt="Download" />
                </div>
              ))
            ) : (
              <p>No shared photos.</p>
            )}
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>
        { isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"
        }
        </button>
        <button className="logout" onClick={()=>auth.signOut()}>Logout</button>
      </div>
    </div>
  )
}

export default Detail
