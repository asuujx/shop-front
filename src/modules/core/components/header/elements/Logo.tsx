import { Link } from 'react-router-dom';

function Logo() {
  return (
    <Link to="/home" className="font-bold">
      <img src="/logo.png" alt="logo" className="w-16" />
    </Link>
  );
}

export default Logo