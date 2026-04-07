export const metadata = {
  title: 'LVBC Sanity Studio',
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        header, footer { display: none !important; }
        main { flex: 1; display: flex; flex-direction: column; }
      `}</style>
      {children}
    </>
  )
}
