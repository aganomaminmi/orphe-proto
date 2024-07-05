import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-10 py-10 min-h-screen">
      <section className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl">This is ower Orphe*Groove Project.</h2>
        <p className="text-lg">This is a prototype for Orphe or Groove.</p>
        <iframe
          src="https://player.vimeo.com/video/904372117?background=1"
          allowFullScreen={true}
        />
      </section>
      <section className="flex flex-col items-center justify-center gap-4">
        <Link
          className="bg-gray-800 text-white p-3 rounded"
          href="/groove-player"
        >
          Groove player
        </Link>
        <Link
          className="bg-gray-800 text-white p-3 rounded"
          href="/step-tempo"
        >
          Step tempo
        </Link>
        <Link
          className="bg-gray-800 text-white p-3 rounded"
          href="/i-am-robot"
        >
          I AM ROBOT
        </Link>
        <Link
          className="bg-gray-800 text-white p-3 rounded"
          href="/groove-skate"
        >
          Groove skate
        </Link>
      </section>
    </main>
  );
}
