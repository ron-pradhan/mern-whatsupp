import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderProfile } from "./config/ChatLogic";
import MessageDisplay from "./MessageDisplay";
import ProfileModal from "./misc/ProfileModal";
import UpdateGroupModal from "./misc/GroupModal";
import "./styles.css";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      console.log(messages);

      setMessages(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Couldn't Fetch Messages",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Couldn't Send Message",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "25px", md: "30px" }}
            pb={3}
            fontFamily="Nato sans"
            px={2}
            justifyContent={{ base: "space-between" }}
            display="flex"
            alignItems="center"
            w="100%"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderProfile(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            jusifyContent="flex-end"
            bg="#E8E8E8"
            p={3}
            h="100%"
            w="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <div className="messages">
                <MessageDisplay messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} mt={3} isRequired>
              <Input
                placeholder="Type your message"
                variant="filled"
                bg="#E0E0E0"
                onChange={handleTyping}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" jusifyContent="center" h="100%">
          <Text fontSize="2xl" pb={3} fontFamily="Nato sans">
            Click User to Chat
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
