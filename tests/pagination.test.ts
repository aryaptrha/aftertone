import { test, describe } from 'node:test';
import assert from 'node:assert';
import { ui } from '../src/i18n/ui.ts';

describe('Pagination & UI Translations', () => {
  test('all pagination keys are present in both id and en locales', () => {
    const requiredKeys = [
      'pagination.previous',
      'pagination.next',
      'pagination.page',
      'pagination.of',
      'pagination.showing',
      'pagination.to',
      'pagination.records',
      'pagination.compartment',
      'pagination.navLabel',
    ] as const;

    for (const key of requiredKeys) {
      assert.ok(ui.id[key], `Missing Indonesian translation for ${key}`);
      assert.ok(ui.en[key], `Missing English translation for ${key}`);
    }
  });

  test('pagination range and page calculations', () => {
    const totalItems = 13;
    const pageSize = 6;
    const totalPages = Math.ceil(totalItems / pageSize);
    assert.strictEqual(totalPages, 3);

    // Page 1
    const p1Start = 1;
    const p1End = Math.min(1 * pageSize, totalItems);
    assert.strictEqual(p1Start, 1);
    assert.strictEqual(p1End, 6);

    // Page 2
    const p2Start = (2 - 1) * pageSize + 1;
    const p2End = Math.min(2 * pageSize, totalItems);
    assert.strictEqual(p2Start, 7);
    assert.strictEqual(p2End, 12);

    // Page 3
    const p3Start = (3 - 1) * pageSize + 1;
    const p3End = Math.min(3 * pageSize, totalItems);
    assert.strictEqual(p3Start, 13);
    assert.strictEqual(p3End, 13);
  });
});
