"use client";
import { Orphe } from "@/lib/orphe/ORPHE-CORE";
import { useCallback, useEffect, useRef, useState } from "react";

const StepTempoPage = () => {
  const [orpheList, setOrpheList] = useState<Orphe[]>([]);

  const gyroList = useRef<{ x: number; y: number; z: number }[]>([]);
  const accelList = useRef<{ x: number; y: number; z: number }[]>([]);
  // rendering更新のため
  const [_, setFrame] = useState(0);

  const addOrphe = () => {
    const index = orpheList.length;
    const orphe = new Orphe(index);
    orphe.setup();
    gyroList.current[index] = { x: 0, y: 0, z: 0 };
    accelList.current[index] = { x: 0, y: 0, z: 0 };

    orphe.gotGyro = function (gyro: any) {
      const alpha = 0.01;
      const prev = gyroList.current[index];
      gyroList.current[index] = {
        x: alpha * gyro.x + (1 - alpha) * prev.x,
        y: alpha * gyro.y + (1 - alpha) * prev.y,
        z: alpha * gyro.z + (1 - alpha) * prev.z,
      };

      setFrame((prev) => prev + 1);
    };

    orphe.gotAcc = function (acc: any) {
      const alpha = 0.01;
      const prev = accelList.current[index];
      accelList.current[index] = {
        x: alpha * acc.x + (1 - alpha) * prev.x,
        y: alpha * acc.y + (1 - alpha) * prev.y,
        z: alpha * acc.z + (1 - alpha) * prev.z,
      };
    };

    setOrpheList([...orpheList, orphe]);

    orphe?.begin("RAW");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-5 py-10 text-white">
      <p>This feature is only available on PC.</p>
      <section className="bg-gray-800 p-5 w-full rounded flex flex-col gap-3">
        <button onClick={addOrphe}>connect</button>
      </section>
      {orpheList.map((orphe, index) => {
        const coreInfo = orphe.id;
        const gyro = gyroList.current[index];
        const acc = accelList.current[index];
        console.log(accelList.current)
        return (
          <section
            className="bg-gray-800 p-5 w-full rounded flex flex-col gap-3"
            key={coreInfo}
          >
            <h1>core{coreInfo}</h1>
            <p>{coreInfo}</p>
            <section>
              <h2>gyro</h2>
              <p>x: {gyro?.x}</p>
              <p>y: {gyro?.y}</p>
              <p>z: {gyro?.z}</p>
            </section>
            <section>
              <h2>acc</h2>
              <p>x: {acc?.x}</p>
              <p>y: {acc?.y}</p>
              <p>z: {acc?.z}</p>
            </section>
          </section>
        );
      })}
    </main>
  );
};

export default StepTempoPage;
