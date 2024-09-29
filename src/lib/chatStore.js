import { create } from 'zustand';
import { doc, getDoc } from "firebase/firestore";
import { database } from './firebaseConfig';
import { useUserStore } from './userStore';

export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isRecieverBlocked: false,
  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;
    const isCurrentUserBlocked = user.blocked.includes(currentUser.id);
    const isReceiverBlocked = currentUser.blocked.includes(user.id);

    set({
      chatId,
      user: isCurrentUserBlocked ? null : user,
      isCurrentUserBlocked,
      isReceiverBlocked,
    });
  },

  changeBlock: () => {
    set((state) => ({
      isReceiverBlocked: !state.isReceiverBlocked,
    }));
  },
}))
