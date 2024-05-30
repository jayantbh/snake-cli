// snake-game.tsx
import React, { useState, useEffect } from 'react';
import { render, Text, useInput, Box } from 'ink';

type Direction = 'up' | 'down' | 'left' | 'right';

interface Position {
    x: number;
    y: number;
}

const initialSnake: Position[] = [
    { x: 2, y: 2 },
    { x: 2, y: 3 },
    { x: 2, y: 4 },
];

const getNextHeadPosition = (head: Position, direction: Direction): Position => {
    switch (direction) {
        case 'up':
            return { x: head.x, y: head.y - 1 };
        case 'down':
            return { x: head.x, y: head.y + 1 };
        case 'left':
            return { x: head.x - 1, y: head.y };
        case 'right':
            return { x: head.x + 1, y: head.y };
    }
};

const SnakeGame: React.FC = () => {
    const [snake, setSnake] = useState<Position[]>(initialSnake);
    const [direction, setDirection] = useState<Direction>('right');
    const [food, setFood] = useState<Position>({ x: 10, y: 10 });
    const [gameOver, setGameOver] = useState(false);

    useInput((input, key) => {
        if (key.upArrow && direction !== 'down') setDirection('up');
        if (key.downArrow && direction !== 'up') setDirection('down');
        if (key.leftArrow && direction !== 'right') setDirection('left');
        if (key.rightArrow && direction !== 'left') setDirection('right');
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setSnake(prevSnake => {
                const newHead = getNextHeadPosition(prevSnake[0], direction);
                const newSnake = [newHead, ...prevSnake.slice(0, -1)];

                if (newHead.x === food.x && newHead.y === food.y) {
                    newSnake.push(prevSnake[prevSnake.length - 1]);
                    setFood({ x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) });
                }

                // Check collision with walls
                if (newHead.x < 0 || newHead.x >= 20 || newHead.y < 0 || newHead.y >= 20) {
                    setGameOver(true);
                    clearInterval(interval);
                }

                // Check collision with self
                if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                    setGameOver(true);
                    clearInterval(interval);
                }

                return newSnake;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [direction, food]);

    return (
        <Box flexDirection="column">
            {gameOver ? (
                <Text color="red">Game Over</Text>
            ) : (
                <Box flexDirection="column">
                    {Array.from({ length: 20 }).map((_, y) => (
                        <Box key={y}>
                            {Array.from({ length: 20 }).map((_, x) => {
                                const isSnake = snake.some(segment => segment.x === x && segment.y === y);
                                const isFood = food.x === x && food.y === y;
                                return (
                                    <Text key={x}>
                                        {isSnake ? '🟡' : isFood ? '🍎' : '◾️'}
                                    </Text>
                                );
                            })}
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

render(<SnakeGame />);
