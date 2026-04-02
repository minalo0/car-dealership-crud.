
export type CarCondition = 'new' | 'used';

export interface Car {
    id: number;
    manufacturer: string;
    model: string;
    year: number;
    condition: CarCondition;
    price: number;
}