"use client";
import { Orphe } from "@/lib/orphe/ORPHE-CORE";
import { useEffect, useState } from "react";

import { Howl } from "howler";
import { map } from "@/lib/utils/map";
import { watchGPS } from "@/lib/gps";

const GroovePlayerPage = () => {
  const [orphe, setOrphe] = useState<Orphe | null>(null);
  const [accelX, setAccelX] = useState<number>(0);
  const [accelY, setAccelY] = useState<number>(0);
  const [accelZ, setAccelZ] = useState<number>(0);

  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);

  const [sound, setSound] = useState<Howl | null>(null);
  const [playList, setPlayList] = useState<number[]>([]);

  useEffect(() => {
    const orphe = new Orphe(1);
    orphe.setup();

    orphe.gotAcc = (acc: any) => {
      setAccelX(acc.x);
      setAccelY(acc.y);
      setAccelZ(acc.z);
    };
    setOrphe(orphe);

    var sound = new Howl({
      // src: ["/Unwelcome-School.m4a"],
      // src: ["/metro120.wav"],
      // src: ["/metro240.mp3"],
      src: ["/Into_The_Night.mp3"],
    });
    setSound(sound);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const id = watchGPS((position) => {
      console.log(position);
      setSpeed(position.coords.speed ?? -1);
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
    return () => {
      window.navigator.geolocation.clearWatch(id);
    }
  }, [window]);

  const connect = () => {
    orphe?.begin("RAW");
  };

  const play = () => {
    const id = sound?.play();
    if (!id) {
      return;
    }

    setPlayList([...playList, id]);
  };

  sound?.rate(map(accelY, -0.19, 0.19, 0, 2), playList[0]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 p-5">
      <section className="bg-gray-900 p-5 w-full rounded flex flex-col gap-3">
        <h1>Orphe yey!</h1>
        <button onClick={connect}>connect</button>
        <div className="flex flex-col gap-2">
          <p>accelX: {accelX}</p>
          <p>accelY: {accelY}</p>
          <p>accelZ: {accelZ}</p>
        </div>
        <div>
          <p>latitude: {latitude}</p>
          <p>longitude: {longitude}</p>
          <p>speed: {speed}</p>
        </div>
      </section>
      <section className="bg-gray-900 p-5 w-full rounded flex flex-col gap-3">
        <h1>Audio</h1>
        <button onClick={play}>play</button>
      </section>
    </main>
  );
};

export default GroovePlayerPage;
