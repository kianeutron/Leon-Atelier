export type SizeGuideMatrix = {
  sizes: string[]
  measurements: { label: string; values: string[] }[]
}

export default function SizeGuideTable({ matrix }: { matrix: SizeGuideMatrix }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-sand/40 text-brownDark">
            <th className="text-left px-3 py-2 border border-sand/60">Measurement</th>
            {matrix.sizes.map((sz) => (
              <th key={sz} className="px-3 py-2 border border-sand/60 text-left">{sz}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.measurements.map((m) => (
            <tr key={m.label} className="odd:bg-cream even:bg-cream/60">
              <td className="px-3 py-2 border border-sand/60 text-brownDark whitespace-nowrap">{m.label}</td>
              {m.values.map((v, i) => (
                <td key={i} className="px-3 py-2 border border-sand/60 text-brown whitespace-nowrap">{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
