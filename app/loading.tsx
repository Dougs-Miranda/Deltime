import Image from "next/image";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white" aria-busy="true">
      <div className="flex flex-col items-center gap-5" role="status">
        <div className="relative h-16 w-56 animate-pulse">
          <Image src="/brand/deltime-logo.png" alt="Deltime" fill priority className="object-contain" />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">Deltime / carregando</p>
        <span className="sr-only">Carregando conteúdo</span>
      </div>
    </main>
  );
}
