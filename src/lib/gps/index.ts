export const watchGPS = (callback: (position: GeolocationPosition) => void): number => {
  return window.navigator.geolocation.watchPosition(
    callback,
    /** you can get below data.
     *  latitude
     *  longitude
     *  accuracy
     *  altitude
     *  altitudeAccuracy
     *  heading
     **/
    function (error) {
      var errorMsg = [
        "UNKNOWN_ERROR",
        "PERMISSION_DENIED",
        "POSITION_UNAVAILABLE",
        "TIMEOUT",
      ];
      console.log("Error " + error.code + ":" + errorMsg[error.code]);
    },
    {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0,
    }
  );
};
