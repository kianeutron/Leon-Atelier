import SizeGuideSection from '../../components/size-guide/SizeGuideSection'
import { fetchCategories } from '../../lib/api'
import type { Category } from '../../lib/types'

function buildMatrixForCategory(cat: Category) {
  const slug = (cat.Slug || '').toLowerCase()
  const name = (cat.Name || '').toLowerCase()
  if (slug === 'tops') {
    return {
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      measurements: [
        { label: 'Chest (cm)', values: ['86', '92', '98', '104', '110'] },
        { label: 'Shoulder (cm)', values: ['42', '44', '46', '48', '50'] },
        { label: 'Length (cm)', values: ['66', '68', '70', '72', '74'] },
        { label: 'Sleeve (cm)', values: ['61', '62', '63', '64', '65'] },
      ],
    }
  }
  if (slug === 'bottoms') {
    return {
      sizes: ['28', '30', '32', '34', '36'],
      measurements: [
        { label: 'Waist (cm)', values: ['71', '76', '81', '86', '91'] },
        { label: 'Hip (cm)', values: ['88', '93', '98', '103', '108'] },
        { label: 'Rise (cm)', values: ['25', '26', '27', '28', '29'] },
        { label: 'Inseam (cm)', values: ['76', '78', '80', '82', '84'] },
      ],
    }
  }
  if (slug === 'outerwear') {
    return {
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      measurements: [
        { label: 'Chest (cm)', values: ['90', '96', '102', '108', '114'] },
        { label: 'Shoulder (cm)', values: ['43', '45', '47', '49', '51'] },
        { label: 'Length (cm)', values: ['69', '71', '73', '75', '77'] },
        { label: 'Sleeve (cm)', values: ['62', '63', '64', '65', '66'] },
      ],
    }
  }
  // Knitwear (cashmere and wool knits)
  if (slug.includes('knit') || name.includes('knit')) {
    return {
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      measurements: [
        { label: 'Chest (cm)', values: ['88', '94', '100', '106', '112'] },
        { label: 'Shoulder (cm)', values: ['41', '43', '45', '47', '49'] },
        { label: 'Length (cm)', values: ['65', '67', '69', '71', '73'] },
        { label: 'Sleeve (cm)', values: ['60', '61', '62', '63', '64'] },
      ],
    }
  }
  // Footwear (leather shoes & boots)
  if (
    slug.includes('foot') || slug.includes('shoe') || slug.includes('boot') ||
    name.includes('footwear') || name.includes('shoe') || name.includes('boots')
  ) {
    return {
      sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'],
      measurements: [
        { label: 'US', values: ['7', '8', '9', '10', '11', '12'] },
        { label: 'UK', values: ['6', '7', '8', '9', '10', '11'] },
        { label: 'Foot length (cm)', values: ['25.4', '26.0', '26.7', '27.3', '28.0', '28.6'] },
      ],
    }
  }
  // Generic fallback
  return {
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    measurements: [
      { label: 'Primary (cm)', values: ['-','-','-','-','-'] },
      { label: 'Secondary (cm)', values: ['-','-','-','-','-'] },
    ],
  }
}

export default async function SizeGuidePage() {
  const catsRes = await fetchCategories({ orderby: 'Name asc' })
  const categories = catsRes.value

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-brownDark">Size guide</h1>
        <p className="text-brown/80 mt-2 max-w-2xl">
          Find your best fit across our categories. Measurements are in centimeters and refer to the garment.
          If you’re between sizes, we recommend the larger size for tailored pieces.
        </p>
      </header>

      <div className="grid gap-5 sm:gap-6 grid-cols-1">
        {categories.map((cat) => (
          <SizeGuideSection
            key={cat.Id}
            title={cat.Name}
            subtitle={cat.Description || undefined}
            matrix={buildMatrixForCategory(cat)}
            note={
              cat.Slug === 'bottoms'
                ? 'Inseam based on regular length. Short/long options vary by style.'
                : cat.Slug === 'tops'
                ? 'Chest measured 2.5cm below armhole across the front.'
                : undefined
            }
          />
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-sand bg-cream p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-brownDark mb-2">How to measure</h2>
        <ul className="text-sm text-brown/80 space-y-1 list-disc pl-5">
          <li><strong>Chest</strong>: Measure around the fullest part, under the arms.</li>
          <li><strong>Shoulder</strong>: Across back from shoulder tip to shoulder tip.</li>
          <li><strong>Length</strong>: From high shoulder point to hem.</li>
          <li><strong>Sleeve</strong>: From shoulder seam to cuff.</li>
          <li><strong>Waist</strong>: Around your natural waistline.</li>
          <li><strong>Hip</strong>: Around the fullest part of the seat.</li>
          <li><strong>Inseam</strong>: From crotch seam to hem.</li>
        </ul>
      </section>
    </div>
  )
}
