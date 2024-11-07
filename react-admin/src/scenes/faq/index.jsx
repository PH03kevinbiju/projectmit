import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="HEALTHCARE FRAUD DETECTION FAQ" subtitle="Frequently Asked Questions About Fraud Detection" />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What is Healthcare Fraud Detection?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Healthcare fraud detection involves identifying fraudulent activities in the healthcare sector to protect patients and insurers.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How does the detection system work?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Our system utilizes advanced algorithms and data analysis techniques to identify anomalies and flag potentially fraudulent claims.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Who benefits from fraud detection?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Both healthcare providers and patients benefit, as it helps ensure that resources are used appropriately and reduces unnecessary costs.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What should I do if I suspect fraud?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            If you suspect fraudulent activity, report it to your healthcare provider or the appropriate authorities immediately.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How can I stay informed about fraud trends?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Stay updated by following industry news, attending relevant workshops, and utilizing resources provided by healthcare organizations.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FAQ;
