/*
 * Gas Calculator Modal Component
 * Professional modal for calculating gas mileage and fuel costs
 * Features: Pre-populated with vehicle mileage, responsive design, calculation results
 */

import React, { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { 
  Calculator, 
  Gauge, 
  GasPump, 
  CurrencyDollar, 
  X, 
  TrendUp 
} from 'phosphor-react'

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  mileage: number
  current_mileage?: number
}

interface GasCalculatorModalProps {
  vehicle: Vehicle | null
  isOpen: boolean
  onClose: () => void
}

export const GasCalculatorModal: React.FC<GasCalculatorModalProps> = ({
  vehicle,
  isOpen,
  onClose
}) => {
  const [startMileage, setStartMileage] = useState<string>('')
  const [endMileage, setEndMileage] = useState<string>('')
  const [gallonsUsed, setGallonsUsed] = useState<string>('')
  const [fuelCost, setFuelCost] = useState<string>('')
  const [results, setResults] = useState<{
    mpg: number
    costPerMile: number
    totalDistance: number
    costPerGallon: number
  } | null>(null)

  // Pre-populate with current vehicle mileage when modal opens
  useEffect(() => {
    if (vehicle && isOpen) {
      const currentMileage = vehicle.current_mileage || vehicle.mileage
      setStartMileage(currentMileage.toString())
      setEndMileage('')
      setGallonsUsed('')
      setFuelCost('')
      setResults(null)
    }
  }, [vehicle, isOpen])

  const calculateMileage = useCallback(() => {
    const start = parseFloat(startMileage)
    const end = parseFloat(endMileage)
    const gallons = parseFloat(gallonsUsed)
    const cost = parseFloat(fuelCost)

    if (isNaN(start) || isNaN(end) || isNaN(gallons) || isNaN(cost) || gallons <= 0 || end <= start) {
      alert('Please enter valid numbers. End mileage must be greater than start mileage.')
      return
    }

    const totalDistance = end - start
    const mpg = totalDistance / gallons
    const costPerGallon = cost / gallons
    const costPerMile = cost / totalDistance

    setResults({
      mpg: Math.round(mpg * 100) / 100,
      costPerMile: Math.round(costPerMile * 100) / 100,
      totalDistance,
      costPerGallon: Math.round(costPerGallon * 100) / 100
    })
  }, [startMileage, endMileage, gallonsUsed, fuelCost])

  const resetCalculator = () => {
    if (vehicle) {
      const currentMileage = vehicle.current_mileage || vehicle.mileage
      setStartMileage(currentMileage.toString())
    }
    setEndMileage('')
    setGallonsUsed('')
    setFuelCost('')
    setResults(null)
  }

  if (!isOpen || !vehicle) return null

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm transition-all duration-300 ease-out opacity-100"
        style={{ 
          backgroundColor: 'rgba(17, 24, 39, 0.25)',
          backdropFilter: 'blur(4px) saturate(1.8)'
        }}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calculator size={20} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Gas & Mileage Calculator</h2>
              <p className="text-sm text-gray-600">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Close calculator"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="start-mileage" className="block text-sm font-medium text-gray-700 mb-2">
                Starting Odometer Reading
              </label>
              <div className="relative">
                <Gauge size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="start-mileage"
                  type="number"
                  value={startMileage}
                  onChange={(e) => setStartMileage(e.target.value)}
                  placeholder="e.g., 15420"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="end-mileage" className="block text-sm font-medium text-gray-700 mb-2">
                Ending Odometer Reading
              </label>
              <div className="relative">
                <Gauge size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="end-mileage"
                  type="number"
                  value={endMileage}
                  onChange={(e) => setEndMileage(e.target.value)}
                  placeholder="e.g., 15720"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="gallons-used" className="block text-sm font-medium text-gray-700 mb-2">
                Gallons of Fuel Used
              </label>
              <div className="relative">
                <GasPump size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="gallons-used"
                  type="number"
                  step="0.01"
                  value={gallonsUsed}
                  onChange={(e) => setGallonsUsed(e.target.value)}
                  placeholder="e.g., 12.5"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="fuel-cost" className="block text-sm font-medium text-gray-700 mb-2">
                Total Fuel Cost ($)
              </label>
              <div className="relative">
                <CurrencyDollar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="fuel-cost"
                  type="number"
                  step="0.01"
                  value={fuelCost}
                  onChange={(e) => setFuelCost(e.target.value)}
                  placeholder="e.g., 45.50"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mb-6">
            <button
              onClick={calculateMileage}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <Calculator size={16} />
              <span>Calculate</span>
            </button>
            <button
              onClick={resetCalculator}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <X size={16} />
              <span>Reset</span>
            </button>
          </div>

          {/* Results */}
          {results && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-4 flex items-center space-x-2">
                <TrendUp size={16} />
                <span>Calculation Results</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{results.mpg}</div>
                  <div className="text-sm text-green-600">Miles per Gallon</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-green-700">${results.costPerMile}</div>
                  <div className="text-sm text-green-600">Cost per Mile</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{results.totalDistance}</div>
                  <div className="text-sm text-green-600">Miles Driven</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-green-700">${results.costPerGallon}</div>
                  <div className="text-sm text-green-600">Cost per Gallon</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
