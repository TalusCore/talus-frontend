export type User = {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  birthday: Date;
  height: number;
  weight: number;
};

export type Talus = {
  talusId: string;
  name: string;
};

export type ErrorResponse = { response: { data: { message: string } } };
