import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildSystemPrompt,
  formatSingaporeTime,
  withCurrentTime,
} from "../src/prompt.js";

// ICU may use a narrow no-break space before "am"/"pm"; compare on plain spaces.
const plain = (s) => s.replace(/[  ]/g, " ");

test("formatSingaporeTime converts UTC to Singapore time", () => {
  const date = new Date("2026-10-02T02:37:00Z");
  assert.equal(plain(formatSingaporeTime(date)), "Fri, 2 Oct 2026, 10:37 am");
});

test("formatSingaporeTime uses the Singapore date when UTC is still the day before", () => {
  const date = new Date("2026-10-01T18:30:00Z");
  assert.equal(plain(formatSingaporeTime(date)), "Fri, 2 Oct 2026, 2:30 am");
});

test("withCurrentTime puts a labelled Singapore time before the message", () => {
  const date = new Date("2026-10-02T04:05:00Z");
  assert.equal(
    plain(withCurrentTime("Uncle, lunch time already?", date)),
    "[Current time in Singapore (SGT, UTC+8): Fri, 2 Oct 2026, 12:05 pm]\nUncle, lunch time already?",
  );
});

test("buildSystemPrompt has no per-request timestamp or id, so it can be cached", () => {
  const prompt = buildSystemPrompt();
  assert.doesNotMatch(prompt, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
  assert.doesNotMatch(prompt, /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
});
