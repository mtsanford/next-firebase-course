import { User } from "@firebase/auth";
import { createContext } from "react";

export type UserContextType = {
  user: User;
  username: string;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  username: null,
});
