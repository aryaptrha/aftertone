export interface AcousticFormat {
  speed: string;
  rpm: number;
  label: string;
  spineTag: string;
  discType: string;
}

export const acousticFormats: AcousticFormat[] = [
  {
    speed: '33⅓ RPM STEREO',
    rpm: 33,
    label: '33⅓ RPM // STEREO',
    spineTag: 'STEREO LP',
    discType: 'LP',
  },
  {
    speed: '45 RPM STEREO',
    rpm: 45,
    label: '45 RPM // STEREO',
    spineTag: '45 RPM MAXI',
    discType: '12" MAXI',
  },
  {
    speed: '45 RPM EXTENDED PLAY',
    rpm: 45,
    label: '45 RPM // EP STEREO',
    spineTag: '45 RPM EP',
    discType: 'EP',
  },
  {
    speed: '33⅓ RPM MONO',
    rpm: 33,
    label: '33⅓ RPM // MONO',
    spineTag: 'MONO LP',
    discType: 'MONO LP',
  },
  {
    speed: '45 RPM MONO',
    rpm: 45,
    label: '45 RPM // MONO',
    spineTag: '45 RPM SINGLE',
    discType: '7" SINGLE',
  },
  {
    speed: '33⅓ RPM QUADRAPHONIC',
    rpm: 33,
    label: '33⅓ RPM // QUAD',
    spineTag: 'QUADRAPHONIC',
    discType: 'QUAD LP',
  },
  {
    speed: '45 RPM HALF-SPEED',
    rpm: 45,
    label: '45 RPM // HALF-SPEED',
    spineTag: 'HALF-SPEED 45',
    discType: 'AUDIOPHILE',
  },
  {
    speed: '33⅓ RPM DMM',
    rpm: 33,
    label: '33⅓ RPM // DMM',
    spineTag: 'DMM STEREO',
    discType: 'DMM LP',
  },
];

/**
 * Returns a deterministic acoustic format for a given song slug.
 * Allows an explicit string override if provided in the song metadata.
 */
export function getAcousticFormat(slug: string, override?: string): AcousticFormat {
  if (override) {
    const matched = acousticFormats.find(
      (f) =>
        f.speed.toLowerCase() === override.toLowerCase() ||
        f.label.toLowerCase() === override.toLowerCase()
    );
    if (matched) return matched;
    const is45 = override.includes('45');
    return {
      speed: override,
      rpm: is45 ? 45 : 33,
      label: override.replace(/\s+/g, ' // '),
      spineTag: is45 ? '45 RPM' : '33⅓ RPM',
      discType: is45 ? 'SINGLE' : 'LP',
    };
  }

  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return acousticFormats[hash % acousticFormats.length];
}
