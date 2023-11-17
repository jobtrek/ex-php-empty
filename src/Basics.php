<?php

namespace Jobtrek\ExPhp;

class Basics
{
    /**
     * Php is a bit particular from other languages, important things :
     * - PHP files always start with `<?php`
     * - All php variables are prefixed with `$`
     * - Methods are accessed with `->` not `.` like in other languages
     * Modern PHP (version 8+) are very similar to Java, you have a type system, class, interfaces.
     * But php is still a dynamic language, so if you don't provide types, you have no guarantees to get
     * what you want, like in JavaScript.
     *
     * Complete the function to add the two provided int's
     */
    public static function add(int $number1, int $number2): int
    {
        // Complete the code here
    }

    /**
     * Return the length of a string
     */
    public static function length(string $str): int
    {
        // Complete the code here
    }

    /**
     * Return true if the string have more than 10 characters
     */
    public static function condition(string $str): bool
    {
        // Complete the code here
    }

    /**
     * Concatenate two strings
     */
    public static function concatenate(string $str1, string $str2): string
    {
        // Complete the code here
    }

    /**
     * Analyse the string, and return the number of words requested. If the number of
     * words requested is bigger than the string word count, duplicate the last word.
     */
    public static function getWordsToCount(string $str, int $count): string
    {
        // Complete the code here
    }

}
