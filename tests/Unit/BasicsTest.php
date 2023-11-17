<?php

use Jobtrek\ExPhp\Basics;

describe("Basics", function () {
    test("Sum numbers", function () {
        expect(Basics::add(4, 8))
            ->toBe(12);
    });
    test("String length must return true if more than 10 characters", function () {
        expect(Basics::condition("Bojour les amis"))
            ->toBeTrue()
            ->and(Basics::condition("Toto"))
            ->toBeFalse();
    });
    test("Concatenate strings", function () {
        expect(Basics::concatenate("Toto", "Tutu"))
            ->toBe("TotoTutu");
    });
    test("Calculate string length", function () {
        expect(Basics::length("Toto"))
            ->toBe(4)
            ->and(Basics::length("Est-ce que ça marche avec des émojis ? 🤔"))
            ->toBe(40);
    });
    test("Get words to the count", function () {
        expect(Basics::getWordsToCount("Toto Tutu Titi Tata", 2))
            ->toBe("Toto Tutu")
            ->and(Basics::getWordsToCount("Toto Tutu Titi", 5))
            ->toBe("Toto Tutu Titi Titi Titi");
    });
});
