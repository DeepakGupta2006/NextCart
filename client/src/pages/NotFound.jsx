import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container-app flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
    <p className="font-display text-5xl text-pine-500">404</p>
    <p className="text-sm text-ink/60">We couldn't find that page.</p>
    <Link to="/" className="btn-primary">Back to home</Link>
  </div>
);

export default NotFound;
