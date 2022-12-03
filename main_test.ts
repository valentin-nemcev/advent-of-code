import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";

import heredoc from "npm:theredoc";

import * as T from "./main.ts";

Deno.test("task 1", () => {
  const input = heredoc`
    1000
    2000
    3000
    
    4000
    
    5000
    6000
    
    7000
    8000
    9000
    
    10000
  `;
  assertEquals(T.task1(input), 45000);
});

Deno.test("task 2", () => {
  const input = heredoc`
    A Y
    B X
    C Z
  `;
  assertEquals(T.task2(input), 15);
});

Deno.test("task 2 second", () => {
  const input = heredoc`
    A Y
    B X
    C Z
  `;
  assertEquals(T.task2b(input), 12);
});

Deno.test("letterPriority", () => {
  assertEquals(T.letterPriority("a"), 1);
  assertEquals(T.letterPriority("z"), 26);
  assertEquals(T.letterPriority("A"), 27);
  assertEquals(T.letterPriority("Z"), 52);
});

Deno.test("task 3", () => {
  const input = heredoc`
  vJrwpWtwJgWrhcsFMMfFFhFp
  jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
  PmmdzqPrVvPwwTWBwg
  wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
  ttgJtRGJQctTZtZT
  CrZsJsPPZsGzwwsLwLmpwMDw
  `;
  assertEquals(T.task3(input), 157);
  assertEquals(T.task3b(input), 70);
});
