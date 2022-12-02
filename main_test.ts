import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";

import heredoc from "npm:theredoc";

import { task1, task2, task2b } from "./main.ts";

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
  assertEquals(task1(input), 45000);
});

Deno.test("task 2", () => {
  const input = heredoc`
    A Y
    B X
    C Z
  `;
  assertEquals(task2(input), 15);
});

Deno.test("task 2 second", () => {
  const input = heredoc`
    A Y
    B X
    C Z
  `;
  assertEquals(task2b(input), 12);
});
