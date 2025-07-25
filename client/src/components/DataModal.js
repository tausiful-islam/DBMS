import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { dataService } from '../services/dataService';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

const DataModal = ({ isOpen, onClose, data }) => {
  const queryClient = useQueryClient();
  const isEditing = !!data;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // Watch quantity and pricePerUnit for real-time calculation
  const quantity = watch('quantity');
  const pricePerUnit = watch('pricePerUnit');
  const unitType = watch('unitType');
  
  // Calculate total selling price
  const totalSellingPrice = (quantity && pricePerUnit) ? 
    (parseFloat(quantity) * parseFloat(pricePerUnit)).toFixed(2) : '0.00';

  // Reset form when data changes
  useEffect(() => {
    if (data) {
      reset({
        ...data,
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
      });
    } else {
      reset({
        productName: '',
        quantity: '',
        unitType: 'weight',
        unit: 'kg',
        suppliedTo: '',
        date: new Date().toISOString().split('T')[0],
        area: '',
        pricePerUnit: '',
        currency: 'USD',
        category: 'supply',
        quality: 'Standard',
        supplier: '',
        notes: '',
      });
    }
  }, [data, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: dataService.createData,
    onSuccess: () => {
      queryClient.invalidateQueries(['data']);
      toast.success('Entry created successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create entry');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => dataService.updateData(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['data']);
      toast.success('Entry updated successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update entry');
    },
  });

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      quantity: parseFloat(formData.quantity),
      pricePerUnit: parseFloat(formData.pricePerUnit),
    };

    if (isEditing) {
      updateMutation.mutate({ id: data._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEditing ? 'Edit Entry' : 'Add New Entry'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Name *
                </label>
                <select
                  {...register('productName', { required: 'Product name is required' })}
                  className="input-field"
                >
                  <option value="">Select product</option>
                  <option value="Beef">Beef</option>
                  <option value="Chicken">Chicken</option>
                  <option value="Pork">Pork</option>
                  <option value="Lamb">Lamb</option>
                  <option value="Fish">Fish</option>
                  <option value="Turkey">Turkey</option>
                  <option value="Other">Other</option>
                </select>
                {errors.productName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.productName.message}
                  </p>
                )}
              </div>

              {/* Unit Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Unit Type *
                </label>
                <select
                  {...register('unitType', { required: 'Unit type is required' })}
                  className="input-field"
                >
                  <option value="weight">Weight (kg, lbs, tons)</option>
                  <option value="number">Number (pieces, units, items)</option>
                </select>
                {errors.unitType && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.unitType.message}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantity *
                </label>
                <div className="flex space-x-2">
                  <input
                    {...register('quantity', {
                      required: 'Quantity is required',
                      min: { value: 0, message: 'Quantity must be positive' },
                    })}
                    type="number"
                    step={unitType === 'weight' ? '0.01' : '1'}
                    className="input-field flex-1"
                    placeholder={unitType === 'weight' ? '0.00' : '1'}
                  />
                  <select {...register('unit')} className="input-field w-24">
                    {unitType === 'weight' ? (
                      <>
                        <option value="kg">kg</option>
                        <option value="lbs">lbs</option>
                        <option value="tons">tons</option>
                      </>
                    ) : (
                      <>
                        <option value="pieces">pieces</option>
                        <option value="units">units</option>
                        <option value="items">items</option>
                      </>
                    )}
                  </select>
                </div>
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              {/* Supplied To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Supplied To *
                </label>
                <input
                  {...register('suppliedTo', { required: 'Supplied to is required' })}
                  type="text"
                  className="input-field"
                  placeholder="Company or destination"
                />
                {errors.suppliedTo && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.suppliedTo.message}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date *
                </label>
                <input
                  {...register('date', { required: 'Date is required' })}
                  type="date"
                  className="input-field"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Area *
                </label>
                <input
                  {...register('area', { required: 'Area is required' })}
                  type="text"
                  className="input-field"
                  placeholder="Region or location"
                />
                {errors.area && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.area.message}
                  </p>
                )}
              </div>

              {/* Price Per Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price Per Unit *
                </label>
                <div className="flex space-x-2">
                  <input
                    {...register('pricePerUnit', {
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' },
                    })}
                    type="number"
                    step="0.01"
                    className="input-field flex-1"
                    placeholder="0.00"
                  />
                  <select {...register('currency')} className="input-field w-20">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
                {errors.pricePerUnit && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.pricePerUnit.message}
                  </p>
                )}
              </div>

              {/* Total Selling Price (Calculated) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Selling Price
                </label>
                <div className="input-field bg-gray-50 dark:bg-gray-700 text-lg font-semibold text-green-600 dark:text-green-400">
                  ${totalSellingPrice}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Calculated: {quantity || 0} × ${pricePerUnit || 0}
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select {...register('category')} className="input-field">
                  <option value="supply">Supply</option>
                  <option value="demand">Demand</option>
                  <option value="production">Production</option>
                </select>
              </div>

              {/* Quality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quality
                </label>
                <select {...register('quality')} className="input-field">
                  <option value="Premium">Premium</option>
                  <option value="Standard">Standard</option>
                  <option value="Economy">Economy</option>
                </select>
              </div>
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Supplier
              </label>
              <input
                {...register('supplier')}
                type="text"
                className="input-field"
                placeholder="Supplier name (optional)"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="input-field"
                placeholder="Additional notes (optional)"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
                disabled={isLoading}
              >
                {isLoading && <LoadingSpinner size="small" />}
                <span>{isEditing ? 'Update' : 'Create'} Entry</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DataModal;
