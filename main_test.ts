import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";

import heredoc from "npm:theredoc";

import { task1 } from "./main.ts";

Deno.test(function testTask1() {
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
