const regions = [
  { code: 'NA', name: 'North America' },
  { code: 'EU', name: 'Europe' },
  { code: 'AF', name: 'Africa' },
  { code: 'AS', name: 'Asia' },
  { code: 'SA', name: 'South America' },
  { code: 'OC', name: 'Oceania' },
  { code: 'ME', name: 'Middle East' },
]

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { ip } = req.query

    let regionCode = 'NA' // fallback
    if (ip) {
      if (ip.startsWith('196.') || ip.startsWith('102.')) {
        regionCode = 'AF'
      } else if (ip.startsWith('2.') || ip.startsWith('5.')) {
        regionCode = 'EU'
      } else if (ip.startsWith('41.') || ip.startsWith('197.')) {
        regionCode = 'ME'
      } else if (ip.startsWith('66.') || ip.startsWith('104.')) {
        regionCode = 'NA'
      }
    }

    const region = regions.find((r) => r.code === regionCode)
    res.statusCode = 200
    return res.end(JSON.stringify(region))
  }

  res.setHeader('Allow', ['GET'])
  res.statusCode = 405
  return res.end(JSON.stringify({ error: `Method ${req.method} Not Allowed` }))
}
