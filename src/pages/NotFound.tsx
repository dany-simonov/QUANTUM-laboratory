import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-lab-dark text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-quantum-blue">404</h1>
        <p className="text-xl text-quantum-purple mb-4">Страница не найдена</p>
        <Link to="/" className="text-quantum-green hover:text-quantum-green/80 underline">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
