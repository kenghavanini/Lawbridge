export const PRACTICE_AREA_OPTIONS = [
  { value: 'corporate', label: 'Corporate Law' },
  { value: 'litigation', label: 'Civil Litigation' },
  { value: 'intellectual_property', label: 'Intellectual Property' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'family_law', label: 'Family Law' },
] as const;

export const PRACTICE_AREA_LABELS: Record<string, string> = {
  corporate: 'Corporate Law',
  litigation: 'Civil Litigation',
  intellectual_property: 'Intellectual Property',
  real_estate: 'Real Estate',
  family_law: 'Family Law',
};
