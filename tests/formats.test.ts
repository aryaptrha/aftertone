import { test, describe } from 'node:test';
import assert from 'node:assert';
import { acousticFormats, getAcousticFormat } from '../src/data/formats.ts';

describe('Acoustic Formats & Speeds', () => {
  test('formats registry defines authentic vinyl speeds and rpm values', () => {
    assert.ok(acousticFormats.length >= 6, 'Should have diverse format options');
    for (const format of acousticFormats) {
      assert.ok(format.speed.length > 0, 'speed should not be empty');
      assert.ok(format.rpm === 33 || format.rpm === 45 || format.rpm === 78, 'rpm should be standard');
      assert.ok(format.label.length > 0, 'label should not be empty');
      assert.ok(format.spineTag.length > 0, 'spineTag should not be empty');
      assert.ok(format.discType.length > 0, 'discType should not be empty');
    }
  });

  test('getAcousticFormat is deterministic for the same slug', () => {
    const slug = '10-nenzakura';
    const first = getAcousticFormat(slug);
    const second = getAcousticFormat(slug);
    assert.deepStrictEqual(first, second, 'Same slug must return identical format');
  });

  test('getAcousticFormat distributes formats across different slugs', () => {
    const slugs = [
      '10-nenzakura',
      '12-seconds-12-byou',
      'after-rain',
      'aozora-no-soba-ni-ite',
      'ayo-senyumlah',
      'desire',
      'end-roll',
      'inseki-no-kakuritsu',
    ];
    const speeds = new Set(slugs.map((s) => getAcousticFormat(s).speed));
    assert.ok(speeds.size > 1, 'Different songs should receive varied acoustic speeds');
  });

  test('getAcousticFormat respects explicit override', () => {
    const custom = getAcousticFormat('any-slug', '45 RPM EXTENDED PLAY');
    assert.strictEqual(custom.speed, '45 RPM EXTENDED PLAY');
    assert.strictEqual(custom.rpm, 45);

    const arbitrary = getAcousticFormat('any-slug', '78 RPM SHELLAC');
    assert.strictEqual(arbitrary.speed, '78 RPM SHELLAC');
  });
});
