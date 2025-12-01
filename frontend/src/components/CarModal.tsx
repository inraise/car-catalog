import React, { useState, useEffect } from 'react';
import type {Car} from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const carSchema = z.object({
    brand: z.string().min(1, 'Марка обязательна'),
    model: z.string().min(1, 'Модель обязательна'),
    year: z.number()
        .min(1900, 'Год должен быть не менее 1900')
        .max(new Date().getFullYear() + 1, 'Год не может быть в будущем'),
    price: z.number().min(0, 'Цена не может быть отрицательной'),
    mileage: z.number().min(0, 'Пробег не может быть отрицательным'),
    color: z.string().min(1, 'Цвет обязателен'),
    vin: z.string().min(1, 'VIN обязателен').regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Неверный формат VIN')
});

type CarFormData = z.infer<typeof carSchema>;

interface CarModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (carData: Omit<Car, 'id' | 'created_at'>) => Promise<void>;
    car: Car | null;
}

const CarModal: React.FC<CarModalProps> = ({ isOpen, onClose, onSave, car }) => {
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CarFormData>({
        resolver: zodResolver(carSchema),
        defaultValues: {
            brand: '',
            model: '',
            year: new Date().getFullYear(),
            price: 0,
            mileage: 0,
            color: '',
            vin: ''
        }
    });

    useEffect(() => {
        if (car) {
            reset({
                brand: car.brand,
                model: car.model,
                year: car.year,
                price: car.price,
                mileage: car.mileage,
                color: car.color,
                vin: car.vin
            });
        } else {
            reset({
                brand: '',
                model: '',
                year: new Date().getFullYear(),
                price: 0,
                mileage: 0,
                color: '',
                vin: ''
            });
        }
    }, [car, reset, isOpen]);

    const onSubmit = async (data: CarFormData) => {
        setIsLoading(true);
        try {
            await onSave(data);
            onClose();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        {car ? 'Редактировать автомобиль' : 'Добавить автомобиль'}
                    </h3>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Марка *
                        </label>
                        <input
                            type="text"
                            {...register('brand')}
                            className="mt-1 input"
                        />
                        {errors.brand && (
                            <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Модель *
                        </label>
                        <input
                            type="text"
                            {...register('model')}
                            className="mt-1 input"
                        />
                        {errors.model && (
                            <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Год *
                        </label>
                        <input
                            type="number"
                            {...register('year', { valueAsNumber: true })}
                            className="mt-1 input"
                        />
                        {errors.year && (
                            <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Цена (₽) *
                        </label>
                        <input
                            type="number"
                            {...register('price', { valueAsNumber: true })}
                            className="mt-1 input"
                        />
                        {errors.price && (
                            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Пробег (км) *
                        </label>
                        <input
                            type="number"
                            {...register('mileage', { valueAsNumber: true })}
                            className="mt-1 input"
                        />
                        {errors.mileage && (
                            <p className="mt-1 text-sm text-red-600">{errors.mileage.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Цвет *
                        </label>
                        <input
                            type="text"
                            {...register('color')}
                            className="mt-1 input"
                        />
                        {errors.color && (
                            <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            VIN *
                        </label>
                        <input
                            type="text"
                            {...register('vin')}
                            className="mt-1 input uppercase"
                            placeholder="17 символов"
                        />
                        {errors.vin && (
                            <p className="mt-1 text-sm text-red-600">{errors.vin.message}</p>
                        )}
                    </div>
                </form>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-secondary"
                        disabled={isLoading}
                    >
                        Отмена
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        className="btn btn-primary"
                    >
                        {isLoading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CarModal;