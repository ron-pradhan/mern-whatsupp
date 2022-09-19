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
import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router";

function Register() {
  const [name, setName] = useState();
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [confirmPassword, setconfirmPassword] = useState();
  const [profilePicture, setprofilePicture] = useState();
  const [passwordVisibility, setpasswordVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handlePasswordVisibility = () => {
    setpasswordVisibility(!passwordVisibility);
  };

  const postPicture = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Select Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "whatsupp");
      data.append("cloud_name", "whatsuppron");
      fetch("https://api.cloudinary.com/v1_1/whatsuppron/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setprofilePicture(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    if (!name || !password || !email || !confirmPassword) {
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

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Unmatched !!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          profilePicture,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
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
      <FormControl id="name" isRequired marginBottom="10px">
        <FormLabel>Full Name</FormLabel>
        <Input
          placeholder="Enter Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired marginBottom="10px">
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Email Address"
          onChange={(e) => setemail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired marginBottom="10px">
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={passwordVisibility ? "text" : "password"}
            placeholder="Please Enter Your Password"
            onChange={(e) => setpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handlePasswordVisibility}>
              {passwordVisibility ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmPassword" isRequired marginBottom="10px">
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={passwordVisibility ? "text" : "password"}
            placeholder="Confirm Your Password"
            onChange={(e) => setconfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handlePasswordVisibility}>
              {passwordVisibility ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="profilePicture" isRequired marginBottom="10px">
        <FormLabel>Profile Picture</FormLabel>
        <Input
          type="file"
          accept="image/*"
          p={1.5}
          onChange={(e) => postPicture(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        marginTop="15px"
        onClick={handleRegister}
        isLoading={loading}
      >
        Register
      </Button>
    </VStack>
  );
}

export default Register;
