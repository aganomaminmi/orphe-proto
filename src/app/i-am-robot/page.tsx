"use client";
import { Orphe } from "@/lib/orphe/ORPHE-CORE";
import { useCallback, useEffect, useRef, useState } from "react";

const StepTempoPage = () => {
  const [orpheList, setOrpheList] = useState<Orphe[]>([]);
  const [coreInfoList, setCoreInfoList] = useState<any[]>([]);

  const gyroList = useRef<{ x: number; y: number; z: number }[]>([]);
  const [frame, setFrame] = useState(0);

  const addOrphe = () => {
    const index = orpheList.length;
    const orphe = new Orphe(index);
    orphe.setup();
    gyroList.current[index] = { x: 0, y: 0, z: 0 };
    orphe.gotGyro = function(gyro: any) {
      const alpha = 0.01;
      const prev = gyroList.current[index];
      gyroList.current[index] = {
        x: alpha * gyro.x + (1 - alpha) * prev.x,
        y: alpha * gyro.y + (1 - alpha) * prev.y,
        z: alpha * gyro.z + (1 - alpha) * prev.z,
      };

      console.log(index, gyroList.current[index].x);
      setFrame((prev) => prev + 1);
    };
    setOrpheList([...orpheList, orphe]);
    setCoreInfoList([...coreInfoList, orphe.id]);

    orphe?.begin("RAW");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-5 py-10 text-white">
      <p>This feature is only available on PC.</p>
      <section className="bg-gray-800 p-5 w-full rounded flex flex-col gap-3">
        <h1>core1</h1>
        <button onClick={addOrphe}>connect</button>
        {coreInfoList.map((coreInfo) => (
          <p key={coreInfo}>{coreInfo}</p>
        ))}
        {gyroList.current.map((orphe) => (
          <>
            <p key={orphe.x}>{orphe.x}</p>
            <p key={orphe.y}>{orphe.y}</p>
            <p key={orphe.z}>{orphe.z}</p>
          </>
        ))}
      </section>
    </main>
  );
};

export default StepTempoPage;
