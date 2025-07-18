/*
 * FleetPagination Component - Pagination Controls
 * Professional pagination with page info and navigation
 */

import React from 'react'
import { Button } from '../ui'

interface FleetPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  startIndex: number
  onPageChange: (page: number) => void
}

export const FleetPagination: React.FC<FleetPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  startIndex,
  onPageChange
}) => {
  if (totalPages <= 1) return null

  return (
    <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
      <div className="text-responsive-sm text-gray-700">
        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of{' '}
        {totalItems} vehicles
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="btn-responsive"
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(page)}
            className="btn-responsive"
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="btn-responsive"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
