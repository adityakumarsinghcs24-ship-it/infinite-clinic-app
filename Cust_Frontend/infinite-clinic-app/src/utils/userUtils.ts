// Utility functions for user data handling

export const getDisplayUsername = (username: string | undefined): string => {
  if (!username) return 'User';
  
  // If username contains @, extract the part before @
  if (username.includes('@')) {
    return username.split('@')[0];
  }
  
  return username;
};

export const cleanUserData = (userData: any) => {
  if (!userData) return userData;
  
  return {
    ...userData,
    username: getDisplayUsername(userData.username)
  };
};