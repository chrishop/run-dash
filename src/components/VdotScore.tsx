interface VdotScoreProps {
  vdot: number | null
}

export function VdotScore({ vdot }: VdotScoreProps) {
  if (vdot === null) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">VDOT</h2>
        <p className="text-gray-500">Time is outside the VDOT table range (30.0–85.0)</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">VDOT</h2>
      <p className="text-5xl font-bold text-blue-600">{vdot.toFixed(1)}</p>
    </div>
  )
}
