import { useSelector } from "react-redux";

export default function UserAuth() {
  const { user } = useSelector((state) => state.auth);
  
  if (user) {
    return true;
  } else {
    return false;
  }
}