import test from 'node:test';
import assert from 'node:assert/strict';
import { parseContributionCalendar } from './contributions.mjs';

const FIXTURE = `
<div class="js-yearly-contributions">
  <table>
    <tr>
      <td tabindex="0" data-ix="0" data-date="2026-01-01" id="contribution-day-component-0-0" data-level="1" class="ContributionCalendar-day"></td>
      <td tabindex="0" data-ix="1" data-date="2026-01-02" id="contribution-day-component-0-1" data-level="4" class="ContributionCalendar-day"></td>
      <td tabindex="0" data-ix="2" data-date="2026-01-03" id="contribution-day-component-0-2" data-level="0" class="ContributionCalendar-day"></td>
    </tr>
  </table>
  <tool-tip id="tooltip-1" for="contribution-day-component-0-0">1 contribution on January 1st.</tool-tip>
  <tool-tip id="tooltip-2" for="contribution-day-component-0-1">12 contributions on January 2nd.</tool-tip>
  <tool-tip id="tooltip-3" for="contribution-day-component-0-2">No contributions on January 3rd.</tool-tip>
</div>`;

test('parses dates and exact counts from calendar HTML', () => {
  assert.deepEqual(parseContributionCalendar(FIXTURE), [
    { date: '2026-01-01', count: 1 },
    { date: '2026-01-02', count: 12 },
    { date: '2026-01-03', count: 0 },
  ]);
});

test('parses thousands separators', () => {
  const html = FIXTURE.replace('12 contributions', '1,234 contributions');
  const days = parseContributionCalendar(html);
  assert.equal(days[1].count, 1234);
});

test('returns days sorted by date even if cells are unordered', () => {
  const html = FIXTURE
    .replace('data-date="2026-01-01"', 'data-date="2026-01-03"')
    .replace('data-date="2026-01-03"', 'data-date="2026-01-01"');
  const days = parseContributionCalendar(html);
  assert.deepEqual(days.map((d) => d.date), [
    '2026-01-01',
    '2026-01-02',
    '2026-01-03',
  ]);
});

test('returns an empty list for HTML without calendar cells', () => {
  assert.deepEqual(parseContributionCalendar('<p>nothing here</p>'), []);
});
