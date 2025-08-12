export const Approvedhtml = (name: string) => `
 <div style="font-family: Arial, sans-serif; color: #222">
  <h2>Congratulations, ${name}!</h2>
  <p>
    Your institution application has been <strong>approved</strong> by our team.
  </p>
  <p>
    You can now create your organization on Foundly and start managing lost &
    found items for your institution.
  </p>
  <p style="margin: 32px 0">
    <a
      href="https://app.foundlyhq.com/signup/institution/create-approved"
      style="
        display: inline-block;
        padding: 12px 24px;
        background: #00bcf9;
        color: #fff;
        text-decoration: none;
        border-radius: 100px;
        font-weight: medium;
        font-size: 16px;
      "
      >Create Your Organization</a
    >
  </p>
  <p>
    If you have any questions or need help, reply to this email or contact
    support.
  </p>
  <hr style="margin: 32px 0" />
  <small
    >This link is only for approved institutions. If you did not request this,
    please ignore this email.</small
  >
</div>

`;
