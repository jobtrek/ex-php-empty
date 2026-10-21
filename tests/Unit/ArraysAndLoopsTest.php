<?php

use Jobtrek\ExPhp\ArraysAndLoops;
use Jobtrek\ExPhp\Data\User;

describe("Arrays and loops", function () {
    test("Array with 100 random numbers between 1 and 10", function () {
        $data = ArraysAndLoops::generateRandomArray();
        expect($data)
            ->toBeArray()
            ->toBeList()
            ->toHaveLength(100)
            ->each->toBeInt()->toBeBetween(1, 10);
    });
    test("Random array is actually random", function () {
        // The odds of 100 random draws being all the same value, or of two
        // arrays being identical, are negligible
        expect(count(array_unique(ArraysAndLoops::generateRandomArray())))
            ->toBeGreaterThan(1)
            ->and(ArraysAndLoops::generateRandomArray())
            ->not->toBe(ArraysAndLoops::generateRandomArray());
    });
    test("Count frequency of apparition in array", function () {
        $data = ArraysAndLoops::countNumbers([0, 0, 1, 2, 3, 5, 2, 3, 4, 3, 3, 3, 4]);
        expect($data)->toBeArray();
        // Key order is not part of the exercise, only the counts matter
        ksort($data);
        expect($data)
            ->toBe([0 => 2, 1 => 1, 2 => 2, 3 => 5, 4 => 2, 5 => 1]);
    });
    test("Count frequency with edge cases", function () {
        $single = ArraysAndLoops::countNumbers([7]);
        $same = ArraysAndLoops::countNumbers([9, 9, 9, 9]);
        $negative = ArraysAndLoops::countNumbers([-1, 10, -1]);
        ksort($negative);
        expect(ArraysAndLoops::countNumbers([]))
            ->toBe([])
            ->and($single)
            ->toBe([7 => 1])
            ->and($same)
            ->toBe([9 => 4])
            ->and($negative)
            ->toBe([-1 => 2, 10 => 1]);
    });
    test("Filter users array", function () {
        $data = [
            new User("Archibald", 20),
            new User("Dana", 28),
            new User("Emmalee", 18),
            new User("Jacen", 34),
            new User("Jacen", 28),
        ];
        expect(ArraysAndLoops::filterUsers($data, "getName", "Archibald"))
            ->toBeArray()
            ->toHaveLength(1)
            ->each(fn ($user) => $user->getName()->toBe("Archibald"))
            ->and(ArraysAndLoops::filterUsers($data, "getName", "Jacen"))
            ->toBeArray()
            ->toHaveLength(2)
            ->each(fn ($user) => $user->getName()->toBe("Jacen"))
            ->and(ArraysAndLoops::filterUsers($data, "getAge", 20))
            ->toBeArray()
            ->toHaveLength(1)
            ->each(fn ($user) => $user->getAge()->toBe(20))
            ->and(ArraysAndLoops::filterUsers($data, "getAge", 28))
            ->toBeArray()
            ->toHaveLength(2)
            ->each(fn ($user) => $user->getAge()->toBe(28))
            ->and(ArraysAndLoops::filterUsers($data, "getAge", "28"))
            ->toBeArray()
            ->toHaveLength(0)
            ->and(ArraysAndLoops::filterUsers($data, "getName", "Unknown"))
            ->toBeArray()
            ->toHaveLength(0)
            ->and(ArraysAndLoops::filterUsers([], "getName", "Jacen"))
            ->toBeArray()
            ->toHaveLength(0);
    });
    test("User transformation", function () {
        $data = [
            new User("toto", 21),
            new User("Porsha", 28),
            new User("felton", 17),
            new User("jacen", 34),
            new User("baby", 0),
        ];
        $correct = [
            new User("Toto", 31),
            new User("Porsha", 16),
            new User("Felton", 27),
            new User("Jacen", 19),
            new User("Baby", 2),
        ];
        expect(ArraysAndLoops::transformUsers($data))
            ->toBeArray()
            ->toEqual($correct)
            ->and(ArraysAndLoops::transformUsers([]))
            ->toBe([]);
    });
});
