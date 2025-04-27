export default function useRandom(size: number = 10) {
    return () => {
        const array = new Uint32Array(size);

        crypto.getRandomValues(array);

        return array.join("-");
    };
}
