import React from "react"

type CellProps = {
  type: number | string
  color: string
  isFlashing?: boolean
}

const Cell: React.FC<CellProps> = ({ type, color, isFlashing = false }) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case "orange":
        return "bg-orange-500 border-orange-300"
      case "blue":
        return "bg-blue-500 border-blue-300"
      case "cyan":
        return "bg-cyan-500 border-cyan-300"
      case "red":
        return "bg-red-500 border-red-300"
      case "green":
        return "bg-green-500 border-green-300"
      case "purple":
        return "bg-purple-500 border-purple-300"
      case "yellow":
        return "bg-yellow-500 border-yellow-300"
      default:
        return "bg-gray-900"
    }
  }

  return (
    <div
      className={`w-6 h-6 ${
        type === 0 ? "bg-gray-900" : getColorClass(color)
      } ${type !== 0 ? "border shadow-sm shadow-white/20" : ""} ${isFlashing ? "animate-pulse bg-white" : ""}`}
      style={{
        boxShadow: type !== 0 ? `inset 0 0 8px rgba(255, 255, 255, 0.3)` : "none",
      }}
    />
  )
}

export default React.memo(Cell)
