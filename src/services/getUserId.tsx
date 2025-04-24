function getRandomUserId() {
    const array = new Uint32Array(10);

    crypto.getRandomValues(array);

    return array.join("-");
}

export default function getUserId() {
    let userId = localStorage.getItem("userid");

    if (userId != null) return userId;

    userId = getRandomUserId();

    localStorage.setItem("userid", userId);

    return userId;
}
