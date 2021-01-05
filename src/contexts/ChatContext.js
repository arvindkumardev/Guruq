import React, { createContext, useContext, useEffect, useState } from 'react';
import wsLink from '..';
import {
    MessagesQuery,
    useChatListUsersQuery,
    useChatUserEnteredSubscription,
    useChatUserLeavedSubscription,
    useMessagesQuery,
    useNewMessageSubscription,
    useSendMessageMutation,
} from '../graphql/generated/graphql';
import { useSnackBarContext } from './SnackBarContext';
import { useUserContext } from './UserContext';

export type Message = MessagesQuery['messages'][0];

type ChatContextType = {
    messages: Message[];
    chatUsers: string[];
    sendMessage: (content: string, nickname: string) => Promise<void>;
};

export const ChatContext = createContext<ChatContextType>({
    chatUsers: [],
    messages: [],
    sendMessage: () => {
        throw new Error('you should only use this context inside the provider!');
    },
});

// hook to separate specific ChatUser logic from provider
const useChatUsers = () => {
    const { user } = useUserContext();
    const { snackBar } = useSnackBarContext();
    const [chatUsers, setChatUsers] = useState<string[]>([]);
    const { data: chatUsersRes, refetch: fetchChatUsers } = useChatListUsersQuery();
    const { data: userEntered } = useChatUserEnteredSubscription();
    const { data: userLeaved } = useChatUserLeavedSubscription();

    // fetch chat users in app startup
    useEffect(() => {
        if (chatUsersRes?.chatListUsers) {
            setChatUsers(chatUsersRes.chatListUsers);
        }
    }, [chatUsersRes]);

    // refetch chat users on user login
    useEffect(() => {
        const userLoggedIn = async () => {
            if (user) {
                await fetchChatUsers();
            }
        };
        userLoggedIn();
    }, [user]);

    // handles new user subscription event
    // - add to chatUsers
    // - alerts current user via snackbar
    useEffect(() => {
        if (!userEntered?.chatUserEntered) {
            return;
        }

        setChatUsers([...chatUsers, userEntered.chatUserEntered]);
        snackBar(`The user ${userEntered.chatUserEntered} has joined!`);
    }, [userEntered]);

    // handles user leaving chat subscription event
    // - remove it from chatUsers
    // - alerts current user via snackbar
    useEffect(() => {
        if (!userLeaved?.chatUserLeaved) {
            return;
        }

        setChatUsers(chatUsers.filter((el) => el !== userLeaved.chatUserLeaved));
        snackBar(`The user ${userLeaved.chatUserLeaved} has leaved the chat!`);
    }, [userLeaved]);

    return {
        chatUsers,
    };
};

// hook to separate specific Messages logic from provider
const useMessages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const { user } = useUserContext();

    const { data: initialMessages, refetch: fetchMessages } = useMessagesQuery();
    const { data: newMessageEvent } = useNewMessageSubscription();

    // fetch chat messages in app startup
    useEffect(() => {
        if (initialMessages?.messages) {
            setMessages(initialMessages.messages);
        }
    }, [initialMessages]);


    // handles new message subscription event
    useEffect(() => {
        if (newMessageEvent?.messageSent) {
            setMessages([...messages, newMessageEvent.messageSent]);
        }
    }, [newMessageEvent]);


    // refetch messages on user login
    useEffect(() => {
        const userLoggedIn = async () => {
            if (user) {
                await fetchMessages();
            }
        };
        userLoggedIn();
    }, [user]);

    return {
        messages,
    };
};

const ChatProvider: React.FC = ({ children }) => {
    const { chatUsers } = useChatUsers();
    const { messages } = useMessages();

    const [sendMessage] = useSendMessageMutation();

    return (
        <ChatContext.Provider
            value={{
                messages,
                chatUsers,

                async sendMessage(content, nickname) {
                    if (!content) {
                        return;
                    }

                    await sendMessage({
                        variables: {
                            content,
                            nickname,
                        },
                    });
                },
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;

export function useChatContext() {
    return useContext(ChatContext);
}
