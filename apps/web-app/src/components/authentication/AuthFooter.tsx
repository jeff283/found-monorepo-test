export default function AuthFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="caption-small text-muted text-center mt-4">
      &copy; {currentYear}, all rights reserved &nbsp; | &nbsp;
      <a href="/policies" className="hover:underline text-muted-foreground">
        Privacy and policy
      </a>
    </div>
  );
}
