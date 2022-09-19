import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../../UserAvatar/UserListItem";
import UserBadgeItem from "../../UserAvatar/UserBadgeItem";

const GroupModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const handleAddUsers = async (query) => {
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
  const handleGroup = async (addUser) => {
    if (selectedUsers.includes(addUser)) {
      toast({
        title: "User Already Exists",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, addUser]);
  };
  const handleDelete = (delUser) => {
    setSelectedUsers(
      selectedUsers.filter((selected) => selected._id !== delUser._id)
    );
  };
  const handleSubmit = async () => {
    if (!groupName || !selectedUsers) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/creategroup`,
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <div>
      <span onClick={onOpen}>{children}</span>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader
              fontSize="35px"
              fontFamily="Nato sans"
              display="flex"
              justifyContent="center"
            >
              New Group Chat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormControl>
                <Input
                  mb={3}
                  placeholder="Group Name"
                  onChange={(e) => {
                    setGroupName(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Search Users"
                  mb={1}
                  onChange={(e) => handleAddUsers(e.target.value)}
                />
              </FormControl>
              <Box w="100%" display="flex" flexWrap="wrap">
                {selectedUsers.map((user) => (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleDelete(user)}
                  />
                ))}
              </Box>

              {loading ? (
                <span>loading</span>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
};

export default GroupModal;
