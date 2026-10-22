<?php

use Jobtrek\ExPhp\Basics;

describe("Basics", function () {
    test("Sum numbers", function () {
        expect(Basics::add(4, 8))
            ->toBe(12)
            ->and(Basics::add(0, 0))
            ->toBe(0)
            ->and(Basics::add(-5, 3))
            ->toBe(-2);
    });
    test("String length must return true if more than 10 characters", function () {
        expect(Basics::condition("Bojour les amis"))
            ->toBeTrue()
            ->and(Basics::condition("Toto"))
            ->toBeFalse()
            ->and(Basics::condition(""))
            ->toBeFalse()
            // Exactly 10 characters is not "more than 10"
            ->and(Basics::condition("0123456789"))
            ->toBeFalse()
            ->and(Basics::condition("0123456789a"))
            ->toBeTrue()
            // 10 characters, but 20 bytes
            ->and(Basics::condition("éééééééééé"))
            ->toBeFalse();
    });
    test("Concatenate strings", function () {
        expect(Basics::concatenate("Toto", "Tutu"))
            ->toBe("TotoTutu")
            ->and(Basics::concatenate("Tutu", "Toto"))
            ->toBe("TutuToto")
            ->and(Basics::concatenate("", "Toto"))
            ->toBe("Toto")
            ->and(Basics::concatenate("Toto", ""))
            ->toBe("Toto");
    });
    test("Calculate string length", function () {
        expect(Basics::length("Toto"))
            ->toBe(4)
            ->and(Basics::length(""))
            ->toBe(0)
            ->and(Basics::length("Est-ce que ça marche avec des é ou des è ou encore $ ! à ê ?"))
            ->toBe(60);
    });
    test("Get words to the count", function () {
        expect(Basics::getWordsToCount("Toto Tutu Titi Tata", 2))
            ->toBe("Toto Tutu")
            ->and(Basics::getWordsToCount("Toto Tutu Titi Tata", 1))
            ->toBe("Toto")
            ->and(Basics::getWordsToCount("Toto Tutu Titi Tata", 4))
            ->toBe("Toto Tutu Titi Tata")
            ->and(Basics::getWordsToCount("Toto Tutu Titi", 5))
            ->toBe("Toto Tutu Titi Titi Titi")
            ->and(Basics::getWordsToCount("Toto", 3))
            ->toBe("Toto Toto Toto");
    });
});
