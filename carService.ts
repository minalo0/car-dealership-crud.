import { Car, CarCondition } from '../types/car';
import { cars, getNextId } from '../data/database'; 

export function createCar(
    manufacturer: string,
    model: string,
    year: number,
    condition: CarCondition,
    price: number
): Car {
    const newCar: Car = {
        id: getNextId(), 
        manufacturer,
        model,
        year,
        condition,
        price
    };
    
    cars.push(newCar);
    return newCar;
}

export function readAllCars(): Car[] {
    return [...cars]; 
}

export function readCarById(id: number): Car | undefined {
    return cars.find(car => car.id === id);
}

export function updateCar(
    id: number,
    updates: Partial<Car>
): boolean {
    const index = cars.findIndex(car => car.id === id);
    
    if (index === -1) {
        return false; 
    }
    
    cars[index] = { ...cars[index], ...updates, id };
    return true;
}

export function deleteCar(id: number): boolean {
    const index = cars.findIndex(car => car.id === id);
    
    if (index !== -1) {
        cars.splice(index, 1);
        return true;
    }
    
    return false;
}

export function formatCar(car: Car): string {
    const conditionText = car.condition === 'new' ? '🆕 Новая' : '🔄 Б/У';
    return `#${car.id} | ${car.manufacturer} ${car.model} (${car.year}) | ${conditionText} | $${car.price.toLocaleString()}`;
}

export function displayCars(carsList: Car[]): void {
    if (carsList.length === 0) {
        console.log('\n📭 Каталог пуст');
        return;
    }
    
    console.log('\n🚗 Список автомобилей:');
    console.log('─'.repeat(50));
    carsList.forEach(car => {
        console.log(formatCar(car));
    });
    console.log('─'.repeat(50));
}