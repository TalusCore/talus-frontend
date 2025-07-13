export type User = {
  firstName: string;
  lastName: string;
  email: string;
};

export type Talus = {
  talusId: string;
  name: string;
};

export type ErrorResponse = { response: { data: { message: string } } };
