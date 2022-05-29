import {
  DnsQueries,
  DnsQueryForm,
  Footer,
  Header,
  NTPQueryForm,
} from "./components";
import "./App.css";
import { Grid } from "@mui/material";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={12} md={4} xl={3}>
          <DnsQueryForm />
          <div className="pt-7" />
          <NTPQueryForm />
        </Grid>
        <Grid item xs={12} md={8} xl={9}>
          <DnsQueries />
        </Grid>
        <Grid item xs={12}>
          <Footer />
        </Grid>
      </Grid>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
