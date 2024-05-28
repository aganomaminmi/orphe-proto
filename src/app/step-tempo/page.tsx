"use client";
import { Orphe } from "@/lib/orphe/ORPHE-CORE";
import { useCallback, useEffect, useState } from "react";

const StepTempoPage = () => {
  const [orphe, setOrphe] = useState<Orphe | null>(null);
  const [tempo, setTempo] = useState<number>(0);
  const [outputMidiList, setOutputMidiList] = useState<MIDIOutput[]>([]);
  const [outputMidi, setOutputMidi] = useState<MIDIOutput | null>(null);
  const [coreInfo, setCoreInfo] = useState<any>({});

  const connectMidi = useCallback(() => {
    if (typeof window !== "undefined") {
      window.navigator.requestMIDIAccess().then((midi) => {
        setOutputMidiList([]);
        midi.outputs.forEach((output) => {
          setOutputMidiList((exists) => [...exists, output]);
        });
      });
    }
  }, [window]);

  useEffect(() => {
    const orphe = new Orphe(0);
    orphe.setup();

    orphe.gotGait = function (gait: any) {
      setCoreInfo(gait);
    };

    setOrphe(orphe);
    connectMidi();
  }, []);

  const connect = () => {
    orphe?.begin("RAW");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 p-5">
      <section className="bg-gray-900 p-5 w-full rounded flex flex-col gap-3 text-white">
        <h1>Orphe yey!</h1>
        <button onClick={connect}>connect</button>
        {Object.entries(coreInfo).map(([key, value]: [string, any]) => (
          <p key={key}>
            {key}: {value}
          </p>
        ))}
      </section>
      <section className="bg-gray-900 p-5 w-full rounded flex flex-col gap-3 text-white">
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
      <section className="bg-gray-900 p-5 w-full rounded flex flex-col gap-3 text-white">
        <h1>Audio</h1>
        <p>tempo: {tempo}</p>
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
