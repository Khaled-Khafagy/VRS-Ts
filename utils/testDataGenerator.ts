import { faker } from '@faker-js/faker';

export interface DestinationOption {
    slug: string;
    heading: string;
    tab: 'regions' | 'countries';
}

const REGIONS: DestinationOption[] = [
    { slug: 'europe',        heading: 'Europe',               tab: 'regions' },
    { slug: 'north-america', heading: 'North America',        tab: 'regions' },
    { slug: 'middle-east',   heading: 'Middle East',          tab: 'regions' },
    { slug: 'africa',        heading: 'Africa',               tab: 'regions' },
    { slug: 'asia',          heading: 'Asia',                 tab: 'regions' },
    { slug: 'caribbean',     heading: 'Caribbean',            tab: 'regions' },
    { slug: 'south-america', heading: 'Latin America',        tab: 'regions' },
    { slug: 'oceania',       heading: 'Oceania',              tab: 'regions' },
];

const COUNTRIES: DestinationOption[] = [
    { slug: 'italy',        heading: 'Italy',                 tab: 'countries' },
    { slug: 'uk',           heading: 'United Kingdom (UK)',   tab: 'countries' },
    { slug: 'south-africa', heading: 'South Africa',          tab: 'countries' },
    { slug: 'france',       heading: 'France',                tab: 'countries' },
    { slug: 'spain',        heading: 'Spain',                 tab: 'countries' },
    { slug: 'usa',          heading: 'United States (USA)',   tab: 'countries' },
    { slug: 'egypt',        heading: 'Egypt',                 tab: 'countries' },
    { slug: 'germany',      heading: 'Germany',               tab: 'countries' },
    { slug: 'greece',       heading: 'Greece',                tab: 'countries' },
    { slug: 'kenya',        heading: 'Kenya',                 tab: 'countries' },
];

// Destinations that support the Travel Together Plan.
// Source: confirmed eligible countries/regions list from product team.
export const TRAVEL_TOGETHER_PLAN_DESTINATIONS: DestinationOption[] = [
    // Region
    { slug: 'europe',             heading: 'Europe',                 tab: 'regions'   },
    // Countries
    { slug: 'albania',            heading: 'Albania',                tab: 'countries' },
    { slug: 'argentina',          heading: 'Argentina',              tab: 'countries' },
    { slug: 'brazil',             heading: 'Brazil',                 tab: 'countries' },
    { slug: 'canada',             heading: 'Canada',                 tab: 'countries' },
    { slug: 'colombia',           heading: 'Colombia',               tab: 'countries' },
    { slug: 'dominican-republic', heading: 'Dominican Republic',     tab: 'countries' },
    { slug: 'egypt',              heading: 'Egypt',                  tab: 'countries' },
    { slug: 'france',             heading: 'France',                 tab: 'countries' },
    { slug: 'germany',            heading: 'Germany',                tab: 'countries' },
    { slug: 'greece',             heading: 'Greece',                 tab: 'countries' },
    { slug: 'india',              heading: 'India',                  tab: 'countries' },
    { slug: 'ireland',            heading: 'Ireland',                tab: 'countries' },
    { slug: 'italy',              heading: 'Italy',                  tab: 'countries' },
    { slug: 'japan',              heading: 'Japan',                  tab: 'countries' },
    { slug: 'kenya',              heading: 'Kenya',                  tab: 'countries' },
    { slug: 'mexico',             heading: 'Mexico',                 tab: 'countries' },
    { slug: 'morocco',            heading: 'Morocco',                tab: 'countries' },
    { slug: 'netherlands',        heading: 'Netherlands',            tab: 'countries' },
    { slug: 'new-zealand',        heading: 'New Zealand',            tab: 'countries' },
    { slug: 'portugal',           heading: 'Portugal',               tab: 'countries' },
    { slug: 'south-africa',       heading: 'South Africa',           tab: 'countries' },
    { slug: 'spain',              heading: 'Spain',                  tab: 'countries' },
    { slug: 'switzerland',        heading: 'Switzerland',            tab: 'countries' },
    { slug: 'tanzania',           heading: 'Tanzania',               tab: 'countries' },
    { slug: 'thailand',           heading: 'Thailand',               tab: 'countries' },
    { slug: 'turkey',             heading: 'Turkey',                 tab: 'countries' },
    { slug: 'uae',                heading: 'UAE',                    tab: 'countries' },
    { slug: 'uk',                 heading: 'United Kingdom (UK)',    tab: 'countries' },
    { slug: 'usa',                heading: 'United States (USA)',    tab: 'countries' },
];

// Active test scope — expand to TRAVEL_TOGETHER_PLAN_DESTINATIONS when ready to cover all eligible destinations
export const FOCUSED_TRAVEL_TOGETHER_PLAN_DESTINATIONS: DestinationOption[] = [
    { slug: 'europe', heading: 'Europe', tab: 'regions'   },
    { slug: 'egypt',  heading: 'Egypt',  tab: 'countries' },
];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const pickRandomRegion               = (): DestinationOption => pick(REGIONS);
export const pickRandomCountry              = (): DestinationOption => pick(COUNTRIES);
export const pickRandomDestination          = (): DestinationOption => pick([...REGIONS, ...COUNTRIES]);
export const pickRandomTravelTogetherPlanDestination = (): DestinationOption => pick(FOCUSED_TRAVEL_TOGETHER_PLAN_DESTINATIONS);

export const generateAliasEmail = (): string => {
  const base = process.env.BASE_GMAIL_ALIAS ?? '';
  const [localPart, domain] = base.split('@');
  const suffix = faker.string.alphanumeric({ length: 8 }).toLowerCase();
  return `${localPart}+${suffix}@${domain}`;
};

export const generateGuestUserData = () => {
  const suffix = faker.string.alpha({ length: 4 }).toLowerCase();
  return {
    firstName: `Khaled${suffix}`,
    lastName: `Khafagy${suffix}`,
    email: generateAliasEmail(),
  };
};