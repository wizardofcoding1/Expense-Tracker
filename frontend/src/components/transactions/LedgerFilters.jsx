import React from 'react';
import { Search, Filter } from 'lucide-react';
import CustomSelect from '../CustomSelect';

const LedgerFilters = ({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  sortOrder,
  setSortOrder,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
  selectedTag,
  setSelectedTag,
  availableTags,
  allCategories,
  onReset
}) => {
  const hasActiveFilters = 
    startDate || 
    endDate || 
    search || 
    typeFilter !== 'all' || 
    categoryFilter !== 'all' || 
    minAmount || 
    maxAmount || 
    selectedTag !== 'all' || 
    sortOrder !== 'date-desc';

  return (
    <div className="glass-panel p-5 rounded-2xl space-y-4 shadow-sm relative z-10">
      {/* Row 1: Search, Type, Category, Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="relative md:col-span-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full pl-9 pr-4 py-2 rounded-xl text-xs text-zinc-200"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-zinc-500 flex-shrink-0" />
          <CustomSelect
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { label: 'All Types', value: 'all' },
              { label: 'Incomes Only', value: 'income' },
              { label: 'Expenses Only', value: 'expense' }
            ]}
            buttonClassName="px-3 py-2 text-xs text-zinc-200"
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <div>
          <CustomSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { label: 'All Categories', value: 'all' },
              ...allCategories.map(cat => ({ label: cat.charAt(0).toUpperCase() + cat.slice(1), value: cat }))
            ]}
            buttonClassName="px-3 py-2 text-xs text-zinc-200"
            className="w-full"
          />
        </div>

        {/* Sort Order */}
        <div>
          <CustomSelect
            value={sortOrder}
            onChange={setSortOrder}
            options={[
              { label: 'Date (Newest)', value: 'date-desc' },
              { label: 'Date (Oldest)', value: 'date-asc' },
              { label: 'Amount (Highest)', value: 'amount-desc' },
              { label: 'Amount (Lowest)', value: 'amount-asc' },
              { label: 'Description (A-Z)', value: 'desc-asc' },
              { label: 'Description (Z-A)', value: 'desc-desc' }
            ]}
            buttonClassName="px-3 py-2 text-xs text-zinc-200"
            className="w-full"
          />
        </div>
      </div>

      {/* Row 2: Date Range, Amount Range, Tag filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-zinc-800/40 items-center">
        {/* Date range selection */}
        <div className="flex items-center gap-2">
          <span className="text-xxs font-bold text-zinc-550 uppercase tracking-wider min-w-[70px]">Dates:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="glass-input px-2.5 py-1.5 rounded-xl text-xs text-zinc-200 w-full [color-scheme:light]"
            placeholder="From"
          />
          <span className="text-zinc-550 text-xs">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="glass-input px-2.5 py-1.5 rounded-xl text-xs text-zinc-200 w-full [color-scheme:light]"
            placeholder="To"
          />
        </div>

        {/* Amount range selection */}
        <div className="flex items-center gap-2">
          <span className="text-xxs font-bold text-zinc-550 uppercase tracking-wider min-w-[70px]">Amounts:</span>
          <input
            type="number"
            placeholder="Min ₹"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="glass-input px-2.5 py-1.5 rounded-xl text-xs text-zinc-200 w-full"
          />
          <span className="text-zinc-550 text-xs">to</span>
          <input
            type="number"
            placeholder="Max ₹"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="glass-input px-2.5 py-1.5 rounded-xl text-xs text-zinc-200 w-full"
          />
        </div>

        {/* Reset button */}
        <div className="flex justify-end items-center h-full">
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-xxs text-primary hover:underline font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LedgerFilters;
