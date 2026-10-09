import { Link } from "react-router-dom";

export default function Logo({ className = "logo-img" }) {
  return (
    <Link to="/" className="nav-logo">
      <img 
        src="/logo-dorado.png" 
        alt="Denis Barber Studio" 
        className={className} 
      />
    </Link>
  );
}