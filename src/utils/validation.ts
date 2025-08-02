import * as yup from "yup";

// Login validation schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;

// Registration validation schema
export const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;

// Post validation schema
export const postSchema = yup.object({
  title: yup
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),
  body: yup
    .string()
    .min(10, "Content must be at least 10 characters")
    .required("Content is required"),
  category: yup
    .string()
    .required("Category is required"),
  tags: yup
    .string()
    .optional(),
});

export type PostFormData = yup.InferType<typeof postSchema>;
