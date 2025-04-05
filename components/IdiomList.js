import React from 'react'
import IdiomCard from './IdiomCard'

export default function IdiomList({ idioms, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (idioms.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow p-8">
        <p className="text-gray-700">No idioms found. Please try a different search.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {idioms.map((idiom) => (
        <IdiomCard key={idiom.id} idiom={idiom} />
      ))}
    </div>
  )
}