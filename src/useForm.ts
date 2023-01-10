import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

export interface FormFields {
  name: string;
  email: string;
  password: string;
}

export const useMyForm = () => {
  const FormSchema = z.object({
    name: z.string().min(3).max(10),
    email: z.string().email(),
    password: z
      .string()
      .regex(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/),
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(FormSchema),
  });

  return {
    handleSubmit,
    errors,
    reset,
    control,
  };
};

export type MyForm = ReturnType<typeof useMyForm>;
