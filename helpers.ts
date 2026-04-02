import * as readline from 'readline';

export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export function ask(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer: string | PromiseLike<string>) => {
            resolve(answer);
        });
    });
}

export async function askNumber(prompt: string): Promise<number | null> {
    const input = await ask(prompt);
    const num = Number(input);
    return isNaN(num) ? null : num;
}

export function clearScreen(): void {
    console.clear();
}

export async function pause(message: string = 'Нажмите Enter для продолжения...'): Promise<void> {
    await ask(message);
}