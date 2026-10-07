export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isStrongPassword = (password: string) =>
  password.length >= 8 && /\d/.test(password); // agree on rules as a team

export const isValidName = (name: string) => /[a-zA-Z]/.test(name);