export const requestDeviceMotionPermission = (
  callback: (device: DeviceMotionEvent) => void
) => {
  if (
    DeviceMotionEvent &&
    // @ts-ignore
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    // @ts-ignore
    DeviceMotionEvent.requestPermission()
      .then((permissionState: any) => {
        if (permissionState === "granted") {
          window.addEventListener("devicemotion", callback);
        } else {
          alert('F**k you!!')
        }
      })
      .catch(console.error); // https通信でない場合などで許可を取得できなかった場合
  } else {
    window.addEventListener("devicemotion", callback);
  }
};

export const requestMotionPermission = () => {
  if (
    DeviceMotionEvent &&
    // @ts-ignore
    DeviceMotionEvent.requestPermission &&
    // @ts-ignore
    typeof DeviceMotionEvent.requestPermission === 'function'
  ) {
    // @ts-ignore
    DeviceMotionEvent.requestPermission();
  }
  if (
    DeviceOrientationEvent &&
    // @ts-ignore
    DeviceOrientationEvent.requestPermission &&
    // @ts-ignore
    typeof DeviceOrientationEvent.requestPermission === 'function'
  ) {
    // @ts-ignore
    DeviceOrientationEvent.requestPermission();
  }

  return true
}
