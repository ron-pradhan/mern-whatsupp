import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import Login from "../components/Authentication/Login";
import Register from "../components/Authentication/Register";
import { useHistory } from "react-router-dom";

function HomePage() {
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      history.push("/chats");
    }
  }, [history]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={1}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        backgroundColor="#7c4f44"
      >
        <Text
          align="center"
          color="white"
          fontSize="3xl"
          fontFamily="Noto Sans"
        >
          Whats-Upp
        </Text>
      </Box>
      <Box
        w="100%"
        borderRadius="lg"
        borderWidth="1px"
        bg="#ffffff"
        color="black"
      >
        <Tabs variant="soft-rounded" color="black" margin="10px">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default HomePage;
