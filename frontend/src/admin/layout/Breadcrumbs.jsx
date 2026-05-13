import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      {/* Left side title (last segment of URL) */}
      <h5 className="m-0 text-capitalize">
        {pathnames.length > 0 ? pathnames[pathnames.length - 1] : "Dashboard"}
      </h5>

      {/* Right side breadcrumb links */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb m-0">
          <li className="breadcrumb-item">
            <Link to="/admin">Dashboard</Link>
          </li>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            return (
              <li
                key={index}
                className={`breadcrumb-item ${isLast ? "active" : ""}`}
                aria-current={isLast ? "page" : undefined}
              >
                {isLast ? (
                  <span className="text-capitalize">{name}</span>
                ) : (
                  <Link to={routeTo} className="text-capitalize">
                    {name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
