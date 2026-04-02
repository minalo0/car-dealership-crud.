
import { Car } from '../types/car';

export let cars: Car[] = [
  {
    id: 1,
    manufacturer: 'Toyota',
    model: 'Camry',
    year: 2023,
    condition: 'new',
    price: 35000
  },
  {
    id: 2,
    manufacturer: 'BMW',
    model: 'X5',
    year: 2021,
    condition: 'used',
    price: 52000
  }
];

let _nextId = 3;

export function getNextId(): number {
  return _nextId++;
}

export function clearDatabase(): void {
  cars = [];
  _nextId = 1;
}