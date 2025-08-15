import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
} from "@react-email/components";

interface InstitutionApprovedEmailProps {
  name: string;
}

export const InstitutionApprovedEmail = ({
  name = "<User>",
}: InstitutionApprovedEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading as="h2" style={headingStyle}>
            Congratulations, {name}!
          </Heading>

          <Text style={textStyle}>
            Your institution application has been <strong>approved</strong> by
            our team.
          </Text>

          <Text style={textStyle}>
            You can now create your organization on Foundly and start managing
            lost & found items for your institution.
          </Text>

          <Container style={buttonContainerStyle}>
            <Button
              href="https://app.foundlyhq.com/signup/institution/create-approved"
              style={buttonStyle}
            >
              Create Your Organization
            </Button>
          </Container>

          <Text style={textStyle}>
            If you have any questions or need help, reply to this email or
            contact support.
          </Text>

          <Hr style={hrStyle} />

          <Text style={disclaimerStyle}>
            This link is only for approved institutions. If you did not request
            this, please ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const bodyStyle = {
  fontFamily: "Arial, sans-serif",
  backgroundColor: "#ffffff",
};

const containerStyle = {
  color: "#222222",
  maxWidth: "600px",
  margin: "0 auto",
  padding: "20px",
};

const headingStyle = {
  margin: "0 0 16px 0",
  fontSize: "24px",
  fontWeight: "bold",
};

const textStyle = {
  margin: "16px 0",
  fontSize: "16px",
  lineHeight: "1.5",
};

const buttonContainerStyle = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const buttonStyle = {
  display: "inline-block",
  padding: "12px 24px",
  backgroundColor: "#00bcf9",
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: "100px",
  fontWeight: "500",
  fontSize: "16px",
};

const hrStyle = {
  margin: "32px 0",
  border: "none",
  borderTop: "1px solid #cccccc",
};

const disclaimerStyle = {
  fontSize: "14px",
  color: "#666666",
  margin: "0",
};

export default InstitutionApprovedEmail;
