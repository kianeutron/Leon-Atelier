import SizeGuideTable, { SizeGuideMatrix } from './SizeGuideTable'

export default function SizeGuideSection({
  title,
  subtitle,
  matrix,
  note,
}: {
  title: string
  subtitle?: string
  matrix: SizeGuideMatrix
  note?: string
}) {
  return (
    <section className="rounded-2xl border border-sand bg-cream p-4 sm:p-6 shadow-soft">
      <div className="mb-3">
        <h2 className="text-xl sm:text-2xl font-semibold text-brownDark">{title}</h2>
        {subtitle && <p className="text-sm text-brown/80 mt-1">{subtitle}</p>}
      </div>
      <SizeGuideTable matrix={matrix} />
      {note && <p className="mt-3 text-xs text-brown/70">{note}</p>}
    </section>
  )
}
