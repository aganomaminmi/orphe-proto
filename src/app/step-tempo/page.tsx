"use client";
import { Orphe } from "@/lib/orphe/ORPHE-CORE";
import { useCallback, useEffect, useState } from "react";

const fuckArray: any[] = [];

const StepTempoPage = () => {
  const [tempo, setTempo] = useState<number>(0);
  const [bpm, setBpm] = useState<number>(0);
  const [outputMidiList, setOutputMidiList] = useState<MIDIOutput[]>([]);
  const [outputMidi, setOutputMidi] = useState<MIDIOutput | null>(null);

  const [orphe, setOrphe] = useState<Orphe | null>(null);
  const [coreInfo, setCoreInfo] = useState<any>({});
  const [gaits, setGaits] = useState<any[]>([]);

  const [orphe2, setOrphe2] = useState<Orphe | null>(null);
  const [coreInfo2, setCoreInfo2] = useState<any>({});


  const connectMidi = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.navigator.requestMIDIAccess().then((midi) => {
      setOutputMidiList([]);
      midi.outputs.forEach((output) => {
        setOutputMidiList((exists) => [...exists, output]);
      });
    });
  }, [typeof window]);

  useEffect(() => {
    const orphe = new Orphe(0);
    orphe.setup();
    orphe.gotGait = function (gait: any) {
      console.log("fuck!!!!!!!!!!")
      setCoreInfo(gait);
      // ここを入れないとなぜかcoreInfoがアップデートされない
      const exists = gaits.slice();
      setGaits([...exists, gait]);

      fuckArray.push(Date.now().valueOf());
      if (fuckArray.length > 16) {
        fuckArray.shift();
      }
      console.log(fuckArray);
    };
    setOrphe(orphe);

    const orphe2 = new Orphe(1);
    orphe2.setup();
    orphe2.gotGait = function (gait: any) {
      console.log("fuck!!!!!!!!!!")
      setCoreInfo2(gait);
      // ここを入れないとなぜかcoreInfoがアップデートされない
      const exists = gaits.slice();
      setGaits([...exists, gait]);

      fuckArray.push(Date.now().valueOf());
      if (fuckArray.length > 16) {
        fuckArray.shift();
      }
      console.log(fuckArray);
    };
    setOrphe2(orphe2);

    connectMidi();
  }, []);

  const connect1 = () => {
    orphe?.begin();
  };

  const connect2 = () => {
    orphe2?.begin();
  };

  useEffect(() => {
    const start = fuckArray[0];
    const last = fuckArray.slice(-1)[0];
    const timeDifference = last - start;
    const beatTime = timeDifference / (fuckArray.length - 1);
    const bpm = Math.round((60 * 1000) / beatTime);
    setBpm(bpm)

    const maxBPM = 252;
    const value = (bpm / maxBPM) * 127;
    setTempo(value);

    outputMidi?.send([0xb0, 0, value]);
    outputMidi?.send([0xb0, 1, value]);
  }, [coreInfo.steps]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-5 py-10 text-white">
      <p>This feature is only available on PC.</p>
      <section className="bg-gray-800 p-5 w-full rounded flex flex-col gap-3">
        <h1>core1</h1>
        <button onClick={connect1}>connect</button>
        {Object.entries(coreInfo).map(([key, value]: [string, any]) => (
          <p key={key}>
            {key}: {value}
          </p>
        ))}
      </section>
      <section className="bg-gray-800 p-5 w-full rounded flex flex-col gap-3">
        <h1>core2</h1>
        <button onClick={connect2}>connect</button>
        {Object.entries(coreInfo2).map(([key, value]: [string, any]) => (
          <p key={key}>
            {key}: {value}
          </p>
        ))}
      </section>
      <section className="bg-gray-800 p-5 w-full rounded flex flex-col gap-3">
        <h1>midi devices</h1>
        <p>selected: {outputMidi?.name}</p>
        <select
          className="text-black px-2 py-1 rounded"
          name="output_midi"
          id="output_midi"
          onChange={(e) =>
            setOutputMidi(
              outputMidiList.find((midi) => midi.id === e.target.value) ?? null
            )
          }
        >
          <option value="">no device</option>
          {outputMidiList.map((output) => (
            <option key={output.id} value={output.id}>
              {output.name}
            </option>
          ))}
        </select>
      </section>
      <section className="bg-gray-800 p-5 w-full rounded flex flex-col gap-3 text-white">
        <h1>Audio</h1>
        <p>tempo: {tempo}</p>
        <p>tempo: {bpm}</p>
        <input
          type="range"
          min="0"
          max="127"
          step="1"
          onChange={(e) => {
            const value = Number(e.target.value);
            setTempo(value);
            outputMidi?.send([0xb0, 0, value]);
            outputMidi?.send([0xb0, 1, value]);
          }}
        />
      </section>
    </main>
  );
};

export default StepTempoPage;
