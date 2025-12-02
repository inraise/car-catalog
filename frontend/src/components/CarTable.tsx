import React, {useState, useRef, useEffect} from 'react';
import type {Car} from '../types';

interface CarTableProps {
    cars: Car[];
    onSort: (column: string) => void;
    onEdit: (car: Car) => void;
    onDelete: (id: number) => void;
    sortBy: string;
    order: 'asc' | 'desc';
}

const CarTable: React.FC<CarTableProps> = ({
                                               cars,
                                               onSort,
                                               onEdit,
                                               onDelete,
                                               sortBy,
                                               order
                                           }) => {
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
        brand: 150,
        model: 150,
        year: 100,
        price: 120,
        mileage: 120,
        color: 100,
        vin: 200,
        actions: 150
    });

    const [resizingColumn, setResizingColumn] = useState<string | null>(null);
    const dragStartX = useRef(0);
    const dragStartWidth = useRef(0);

    const columns = [
        {key: 'brand', label: 'Марка'},
        {key: 'model', label: 'Модель'},
        {key: 'year', label: 'Год'},
        {key: 'price', label: 'Цена'},
        {key: 'mileage', label: 'Пробег'},
        {key: 'color', label: 'Цвет'},
        {key: 'vin', label: 'VIN'},
        {key: 'actions', label: 'Действия'}
    ];

    const handleMouseDown = (columnKey: string, e: React.MouseEvent) => {
        setResizingColumn(columnKey);
        dragStartX.current = e.clientX;
        dragStartWidth.current = columnWidths[columnKey];

        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (resizingColumn) {
                const diff = e.clientX - dragStartX.current;
                const newWidth = Math.max(50, dragStartWidth.current + diff);

                setColumnWidths(prev => ({
                    ...prev,
                    [resizingColumn]: newWidth
                }));
            }
        };

        const handleMouseUp = () => {
            setResizingColumn(null);
        };

        if (resizingColumn) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizingColumn]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
    };

    const formatMileage = (mileage: number) => {
        return new Intl.NumberFormat('ru-RU').format(mileage) + ' км';
    };

    return (
        <div className="w-[1100px] bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    {columns.map((column) => (
                        <th
                            key={column.key}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none relative"
                            style={{width: columnWidths[column.key]}}
                            onClick={() => column.key !== 'actions' && onSort(column.key)}
                        >
                            <div className="flex items-center justify-between">
                  <span>
                    {column.label}
                      {sortBy === column.key && (
                          <span className="ml-1">
                        {order === 'asc' ? '↑' : '↓'}
                      </span>
                      )}
                  </span>
                                {column.key !== 'actions' && (
                                    <div
                                        className="w-2 h-full absolute right-0 top-0 cursor-col-resize hover:bg-gray-300"
                                        onMouseDown={(e) => handleMouseDown(column.key, e)}
                                    />
                                )}
                            </div>
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {cars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                            {car.brand}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                            {car.model}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                            {car.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                            {formatPrice(car.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                            {formatMileage(car.mileage)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                            <div className="flex items-center">
                                <div
                                    className="w-4 h-4 rounded-full mr-2"
                                    style={{backgroundColor: car.color.toLowerCase()}}
                                />
                                {car.color}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-900">
                            {car.vin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-medium">
                            <button
                                onClick={() => onEdit(car)}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                                Редактировать
                            </button>
                            <button
                                onClick={() => onDelete(car.id)}
                                className="text-red-600 hover:text-red-900"
                            >
                                Удалить
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CarTable;