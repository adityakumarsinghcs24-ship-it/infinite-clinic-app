import React from "react";
import { useAuth } from "../../context/useAuth";
import { VStack, Text, Button } from "@chakra-ui/react";

import { useEffect, useState } from "react";

export const Home = () => {
  const { user, logoutUser } = useAuth();
  const handleLogout = async () => {
    await logoutUser();
  };
  return (
    <VStack alignItems="start">
      <Text fontSize="42px" pb="30px">
        Welcome {user ? user.username : user.role} 👋
      </Text>
      <Button onClick={handleLogout} colorScheme="red">
        Logout
      </Button>
    </VStack>
  );
};
