import { LoadingButton } from "@mui/lab";
import { Divider, TextField } from "@mui/material";
import dayjs from "dayjs";
import { NTPPacket } from "ntp-time";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { restAPI } from "../../api";

type FormData = {
  to: string;
};

export function NTPQueryForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    toast.info(`Wysłano zapytanie NTP na server ${data.to}`);
    try {
      const resp = await restAPI.get<NTPPacket>(`ntp/time?to=${data.to}`);
      reset();
      toast.success(`Czas zwrócony przez serwer: ${dayjs(resp.data.time)}`);
    } catch (e) {
      toast.error("Nieuzyskano odpowiedzi na zapytanie NTP.");
    }
  };

  return (
    <form className="container" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold mb-3">Zapytanie NTP</h2>
      <Divider />
      <div className="my-5">
        <TextField
          id="to"
          label="Adres serwera NTP"
          variant="filled"
          fullWidth
          {...register("to", {
            required: "To pole jest wymagane",
          })}
          error={Boolean(errors.to?.message)}
          helperText={errors.to?.message}
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
