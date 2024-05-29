"use client";
import { useEffect, useState } from "react";

import { Howl } from "howler";
import { map } from "@/lib/utils/map";
import { watchGPS } from "@/lib/gps";
import { requestMotionPermission } from "@/lib/motion";

const GroovePlayerPage = () => {
  const [accelX, setAccelX] = useState<number>(0);
  const [accelY, setAccelY] = useState<number>(0);
  const [accelZ, setAccelZ] = useState<number>(0);

  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [speed, setSpeed] = useState<number | null>(null);
  const kmPerHour = (speed ?? 0 * 60 * 60) / 1000;

  const [sound, setSound] = useState<Howl | null>(null);
  const [playList, setPlayList] = useState<number[]>([]);
  const [nowPlaying, setNowPlaying] = useState<boolean>(false);

  const [speedRate, setSpeedRate] = useState<number>(0);

  const [hasMotionPermission, setHasMotionPermission] =
    useState<boolean>(false);

  useEffect(() => {
    var sound = new Howl({
      // src: ["/Unwelcome-School.m4a"],
      // src: ["/metro120.wav"],
      // src: ["/metro240.mp3"],
      src: ["/Into_The_Night.mp3"],
      loop: true,
    });
    setSound(sound);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const id = watchGPS((position) => {
      setSpeed(position.coords.speed);
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });

    return () => {
      window.navigator.geolocation.clearWatch(id);
    };
  }, [window]);

  useEffect(() => {
    if (!hasMotionPermission) {
      return;
    }
    const handleMotioin = (event: DeviceMotionEvent) => {
      const acc = event.acceleration;
      setAccelX(acc?.x ?? 0);
      setAccelY(acc?.y ?? 0);
      setAccelZ(acc?.z ?? 0);
    };
    window.addEventListener("devicemotion", handleMotioin);

    return () => {
      window.removeEventListener("devicemotion", handleMotioin);
    };
  }, [hasMotionPermission]);

  const playOrPause = () => {
    if (playList.length > 1 || !sound) {
      return;
    }
    let id = playList[0];
    const playing = sound.playing(id);
    if (playing) {
      sound.pause(id);
    } else if (id) {
      sound.play(id);
    } else {
      id = sound.play();
      setPlayList([...playList, id]);
    }

    setNowPlaying(sound.playing(id));
  };

  const accel = -Math.round(map(accelY, -1, 1, -10, 10));

  useEffect(() => {
    const calcedSpeed = Math.round(kmPerHour + accel) || 5;

    sound?.rate(map(calcedSpeed, 0, 120, 0, 2), playList[0]);

    setSpeedRate(calcedSpeed);
  }, [speed, accelY, sound, playList]);

  useEffect(() => {
    if (!sound) {
      return;
    }
    sound.stereo(map(accelX, -1, 1, 1, -1), playList[0]);
  }, [accelX]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-5 py-10 text-white">
      <section className="bg-gray-800 p-5 w-full rounded flex flex-col gap-3">
        <h1>Orphe yey!</h1>
        <div>
          <p>accelX: {accelX}</p>
          <p>accelY: {accelY}</p>
          <p>accelZ: {accelZ}</p>
        </div>
        <div>
          <p>latitude: {latitude}</p>
          <p>longitude: {longitude}</p>
          <p>speed: {speed ?? "not available now."}</p>
          <p>speed(km/h): {kmPerHour}</p>
        </div>
        <button
          className="bg-gray-500 w-fit px-4 py-1 rounded self-center"
          onClick={() => {
            setHasMotionPermission(requestMotionPermission());
          }}
        >
          request motion
        </button>
      </section>
      <section className="bg-gray-800 p-5 w-full rounded flex flex-col gap-3">
        <h1>Audio</h1>
        <p>speed rate: {speedRate}</p>
        <p>accel correction: {accel}</p>
        <button
          className="bg-gray-500 w-fit px-4 py-1 rounded self-center"
          onClick={playOrPause}
        >
          {nowPlaying ? "pause" : "play"}
        </button>
        {nowPlaying && <p className="self-center">now playing</p>}
      </section>
    </main>
  );
};

export default GroovePlayerPage;
