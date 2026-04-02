import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { 
  createCar, 
  readAllCars, 
  updateCar, 
  deleteCar, 
  displayCars 
} from './services/carService';
import type { Car } from './types/car';
import { CarCondition } from './types/car';

const rl = createInterface({ input, output });

process.on('SIGINT', () => {
  console.log('\n\n👋 Программа завершена пользователем.');
  rl.close();
  process.exit(0);
});

async function showMenu(): Promise<string> {
  console.clear();
  console.log('🚗 CAR DEALERSHIP CRUD');
  console.log('═'.repeat(30));
  console.log('1️⃣  Добавить автомобиль');
  console.log('2️⃣  Показать все автомобили');
  console.log('3️⃣  Обновить автомобиль');
  console.log('4️⃣  Удалить автомобиль');
  console.log('5️⃣  Выход');
  console.log('═'.repeat(30));
  return (await rl.question('\n👉 Выберите действие (1-5): ')).trim();
}

async function handleCreate() {
  console.log('\n📝 ДОБАВЛЕНИЕ АВТОМОБИЛЯ');
  console.log('─'.repeat(25));
  
  const manufacturer = await rl.question('🏭 Производитель (напр. Toyota): ');
  const model = await rl.question('🚘 Модель (напр. Camry): ');
  const yearStr = await rl.question('📅 Год выпуска: ');
  const conditionStr = await rl.question('🆕 Состояние (new/used): ');
  const priceStr = await rl.question('💰 Цена ($): ');

  try {
    const year = parseInt(yearStr, 10);
    const price = parseFloat(priceStr);
    const condition = conditionStr.toLowerCase().trim() as CarCondition;

    if (isNaN(year) || isNaN(price) || (condition !== 'new' && condition !== 'used')) {
      console.log('❌ Ошибка: год и цена должны быть числами, состояние: new или used.');
      return;
    }

    const newCar = createCar(manufacturer.trim(), model.trim(), year, condition, price);
    console.log(`\n✅ Автомобиль добавлен! ID: ${newCar.id}`);
  } catch (err) {
    console.error('❌ Ошибка при добавлении:', err);
  }
}

function handleRead() {
  console.log('\n📋 КАТАЛОГ АВТОМОБИЛЕЙ');
  const cars = readAllCars();
  if (cars.length === 0) {
    console.log('📭 Каталог пуст. Добавьте первый автомобиль.');
  } else {
    displayCars(cars);
  }
}

async function handleUpdate() {
  const idStr = await rl.question('\n🔄 Введите ID автомобиля для обновления: ');
  const id = parseInt(idStr, 10);
  if (isNaN(id)) {
    console.log('❌ ID должен быть числом.');
    return;
  }

  console.log('\n✏️  Оставьте поле пустым, чтобы не изменять его.');
  const manufacturer = await rl.question('🏭 Новый производитель: ');
  const model = await rl.question('🚘 Новая модель: ');
  const yearStr = await rl.question('📅 Новый год: ');
  const conditionStr = await rl.question('🆕 Новое состояние (new/used): ');
  const priceStr = await rl.question('💰 Новая цена ($): ');

  try {
    const updates: Partial<Car> = {};
    if (manufacturer.trim()) updates.manufacturer = manufacturer.trim();
    if (model.trim()) updates.model = model.trim();
    if (yearStr.trim()) updates.year = parseInt(yearStr, 10);
    if (conditionStr.trim()) {
      const cond = conditionStr.toLowerCase().trim();
      if (cond === 'new' || cond === 'used') updates.condition = cond as CarCondition;
      else console.log('⚠️ Неверное состояние, пропущено.');
    }
    if (priceStr.trim()) updates.price = parseFloat(priceStr);

    if (Object.keys(updates).length === 0) {
      console.log('⚠️ Не указано ни одного поля для обновления.');
      return;
    }

    const success = updateCar(id, updates);
    console.log(success ? '✅ Автомобиль успешно обновлен!' : '❌ Автомобиль с таким ID не найден.');
  } catch (err) {
    console.error('❌ Ошибка обновления:', err);
  }
}

async function handleDelete() {
  const idStr = await rl.question('\n🗑️  Введите ID автомобиля для удаления: ');
  const id = parseInt(idStr, 10);
  if (isNaN(id)) {
    console.log('❌ ID должен быть числом.');
    return;
  }

  const success = deleteCar(id);
  console.log(success ? '✅ Автомобиль успешно удален!' : '❌ Автомобиль с таким ID не найден.');
}

async function main() {
  try {
    let running = true;
    while (running) {
      const choice = await showMenu();
      switch (choice) {
        case '1': await handleCreate(); break;
        case '2': handleRead(); break;
        case '3': await handleUpdate(); break;
        case '4': await handleDelete(); break;
        case '5':
          console.log('\n👋 Спасибо за использование Car Dealership! До свидания.');
          running = false;
          break;
        default:
          console.log('\n❌ Неверный выбор. Введите число от 1 до 5.');
      }
      if (running) await rl.question('\n⏎ Нажмите Enter для возврата в меню...');
    }
  } finally {
    rl.close();
  }
}

main().catch(err => {
  console.error('💥 Критическая ошибка:', err);
  process.exit(1);
});