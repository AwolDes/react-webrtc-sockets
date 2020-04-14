export const getDisplayStream = () => {
    return Promise.resolve(navigator.mediaDevices.getDisplayMedia());
}