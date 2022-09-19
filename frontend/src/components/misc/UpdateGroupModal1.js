import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
  Box,
  IconButton,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../../UserAvatar/UserBadgeItem";
import UserListItem from "../../UserAvatar/UserListItem";

const UpdateGroupModal = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupName, setGroupName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  const handleRename = async () => {
    if (!groupName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/renamegroup`,
        {
          chatId: selectedChat._id,
          chatName: groupName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Failed to Update Name",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Couldn't Fetch Chat",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleAddUser = async (newuser) => {
    if (selectedChat.users.find((i) => i._id === newuser._id)) {
      toast({
        title: "User already exits !!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add users",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/addusers`,
        {
          chatId: selectedChat._id,
          userId: newuser._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error in Adding User",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleDelete = async (removeuser) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      removeuser._id !== user._id
    ) {
      toast({
        title: "Only admin can Remove User",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/removeusers`,
        {
          chatId: selectedChat._id,
          userId: removeuser._id,
        },
        config
      );
      removeuser._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error in Adding User",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader
              fontSize="35px"
              fontFamily="Nato sans"
              display="flex"
              justifyContent="center"
            >
              {selectedChat.chatName}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box w="100%" display="flex" flexWrap="wrap">
                {selectedChat.users.map((user) => (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleDelete(user)}
                  />
                ))}
              </Box>
              <FormControl display="flex">
                <Input
                  mb={3}
                  placeholder="Group Name"
                  onChange={(e) => {
                    setGroupName(e.target.value);
                  }}
                />
                <Button
                  variant="solid"
                  colorScheme="teal"
                  ml={1}
                  isLoading={renameLoading}
                  onClick={handleRename}
                >
                  Update Name
                </Button>
              </FormControl>
              <FormControl display="flex">
                <Input
                  mb={3}
                  placeholder="Add Users"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>
              {loading ? (
                <Spinner size="lg" />
              ) : (
                searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3}>
                Exit Group
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default UpdateGroupModal;
