import useLocalStorage from "./useLocalStorage";
import useRandom from "./useRandom";

export default function useUserId() {
    const [userId] = useLocalStorage("userid", useRandom());
    return userId;
}
