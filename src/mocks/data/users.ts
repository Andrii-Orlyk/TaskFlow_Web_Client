export const DEMO_PASSWORD = 'Password123!';

export type MockUserRecord = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export const demoUsers: MockUserRecord[] = [
  {
    id: 'user-demo-primary',
    email: 'taskflow.user@demo.dev',
    password: DEMO_PASSWORD,
    firstName: 'Taskflow',
    lastName: 'User'
  },
  {
    id: 'user-demo-other',
    email: 'taskflow.other@demo.dev',
    password: DEMO_PASSWORD,
    firstName: 'Other',
    lastName: 'Reviewer'
  }
];
