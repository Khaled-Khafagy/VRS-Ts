import { faker } from '@faker-js/faker';

export const generateGuestUserData = () => {
  return {
    firstName: faker.string.alpha({ length: 8 }),
    lastName: faker.string.alpha({ length: 8 }),
    email: faker.internet.email()};
};