import { faker } from '@faker-js/faker';

export const generateGuestUserData = () => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email()};
};