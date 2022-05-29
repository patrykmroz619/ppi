import { LoadingButton } from "@mui/lab";
import { Divider, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { restAPI } from "../../api";
import { isIpAddress } from "../../utils/isIpAddress";

type FormData = {
  domain: string;
  to: string;
};

export function DnsQueryForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await restAPI.post("dns/execute-query", data);
      reset();
      toast.success(`Zapytanie DNS dla domeny ${data.domain} zostało wysłane.`);
    } catch (e) {
      toast.error("Wystąpił błąd podczas wysyłania zapytania DNS.");
    }
  };

  return (
    <form className="container" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold mb-3">Zapytanie DNS</h2>
      <Divider />
      <div className="my-5">
        <TextField
          id="to"
          label="Adres IP serwera DNS"
          variant="filled"
          fullWidth
          {...register("to", {
            required: "To pole jest wymagane",
            validate: {
              ip: (value) =>
                isIpAddress(value) || "To pole musi zawierać poprawny adres IP",
            },
          })}
          error={Boolean(errors.to?.message)}
          helperText={errors.to?.message}
        />
      </div>
      <div className="mb-5">
        <TextField
          id="domain"
          label="Domena"
          variant="filled"
          fullWidth
          {...register("domain", { required: "To pole jest wymagane" })}
          error={Boolean(errors.domain?.message)}
          helperText={errors.domain?.message}
        />
      </div>
      <div className="flex justify-end">
        <LoadingButton type="submit" variant="contained" size="large">
          Wyślij zapytanie
        </LoadingButton>
      </div>
    </form>
  );
}
