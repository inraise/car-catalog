import React, {useState, useEffect, useCallback} from 'react';
import {useAuth} from '../context/AuthContext';
import {carsAPI, type GetCarsParams} from '../api/cars';
import type {Car, PaginationData} from '../types';
import CarTable from '../components/CarTable';
import CarModal from '../components/CarModal';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';

const Cars: React.FC = () => {
    const {logout} = useAuth();
    const [cars, setCars] = useState<Car[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<Car | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const fetchCars = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const params: GetCarsParams = {
                page: pagination.page,
                limit: pagination.limit,
                sortBy,
                order,
                search: searchTerm
            };

            const data = await carsAPI.getCars(params);
            setCars(data.cars);
            setPagination(data.pagination);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, sortBy, order, searchTerm]);

    useEffect(() => {
        fetchCars();
    }, [fetchCars]);

    const handlePageChange = (page: number) => {
        setPagination(prev => ({...prev, page}));
    };

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setOrder(order === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setOrder('asc');
        }
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setPagination(prev => ({...prev, page: 1}));
    };

    const handleCreate = () => {
        setEditingCar(null);
        setModalOpen(true);
    };

    const handleEdit = (car: Car) => {
        setEditingCar(car);
        setModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
            try {
                await carsAPI.deleteCar(id);
                fetchCars();
            } catch (err: any) {
                alert(err.response?.data?.error || 'Ошибка удаления');
            }
        }
    };

    const handleSave = async (carData: Omit<Car, 'id' | 'created_at'>) => {
        try {
            if (editingCar) {
                await carsAPI.updateCar(editingCar.id, carData);
            } else {
                await carsAPI.createCar(carData);
            }
            setModalOpen(false);
            fetchCars();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Ошибка сохранения');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-semibold text-gray-800">Каталог автомобилей</h1>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={logout}
                                className="ml-4 px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                            >
                                Выйти
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="w-[1100px] mx-auto py-6 sm:px-6 lg:px-8">
                <div className="w-[1100px] px-4 py-2 sm:px-0">
                    <div className="mb-6">

                        <div className="mt-4 flex justify-between items-center">
                            <SearchBar onSearch={handleSearch}/>
                            <button
                                onClick={handleCreate}
                                className="btn btn-primary text-sm h-[36px]"
                            >
                                Добавить автомобиль
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12">
                            <div
                                className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : (
                        <>
                            <CarTable
                                cars={cars}
                                onSort={handleSort}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                sortBy={sortBy}
                                order={order}
                            />
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>
            </main>
            <CarModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                car={editingCar}
            />
        </div>
    );
};

export default Cars;