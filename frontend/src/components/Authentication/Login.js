import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router";

function Login() {
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const [passwordVisibility, setpasswordVisibility] = useState(false);

  const handlepasswordVisibility = () => {
    setpasswordVisibility(!passwordVisibility);
  };
  const handleLogin = async () => {
    setLoading(true);
    if (!password || !email) {
      toast({
        title: "Please Fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        {
          email,
          password,
        },
        config
      );
      //console.log(data);
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured !!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl isRequired marginBottom="10px">
        <FormLabel>Email Address</FormLabel>
        <Input
          placeholder="Registered Email Address"
          onChange={(e) => setemail(e.target.value)}
          value={email}
        />
      </FormControl>
      <FormControl isRequired marginBottom="10px">
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={passwordVisibility ? "text" : "password"}
            onChange={(e) => setpassword(e.target.value)}
            value={password}
            placeholder="Please Enter Your Password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handlepasswordVisibility}>
              {passwordVisibility ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        onClick={handleLogin}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        colorScheme="red"
        width="100%"
        onClick={() => {
          setemail("guestuser@gmail.com");
          setpassword("123456");
        }}
      >
        Login as Guest
      </Button>
    </VStack>
  );
}

export default Login;
