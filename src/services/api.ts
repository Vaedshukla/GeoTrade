import type { BaseCountry, CountryData } from '../types';

export const fetchTrackedCountries = async (): Promise<BaseCountry[]> => {
  const response = await fetch('/api/countries');
  if (!response.ok) throw new Error('Failed to fetch countries');
  return response.json();
};

export const fetchCountryIntelligence = async (id: string): Promise<CountryData> => {
  const response = await fetch(`/api/country/${id}`);
  if (!response.ok) throw new Error('Failed to fetch country intelligence');
  return response.json();
};
