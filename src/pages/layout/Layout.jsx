import { Outlet, useNavigate, NavLink } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={styles.page}>

      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.left}>
          <h3>🎓 Alumni</h3>
        </div>

        <div style={styles.links}>
          <NavLink
            to="/dashboard"
            style={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/profile"
            style={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Profil
          </NavLink>

          <NavLink
            to="/documents"
            style={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Documents
          </NavLink>

          <NavLink
            to="/alumni"
            style={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Réseau
          </NavLink>
        </div>

        <button onClick={logout} style={styles.logout}>
          Déconnexion
        </button>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        <Outlet />
      </div>

    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Inter"
  },

  /* 🔥 PREMIUM NAVBAR */
  navbar: {
    height: "65px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 25px",
    background: "rgba(15, 23, 42, 0.85)",
    backdropFilter: "blur(12px)",
    color: "white",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)"
  },

  left: {
    fontWeight: "700",
    letterSpacing: "1px"
  },

  links: {
    display: "flex",
    gap: "25px"
  },

  link: {
    color: "#cbd5e1",
    textDecoration: "none",
    fontWeight: "500",
    transition: "0.2s"
  },

  /* 🔥 ACTIVE LINK */
  activeLink: {
    color: "#3b82f6",
    fontWeight: "700",
    textDecoration: "none",
    borderBottom: "2px solid #3b82f6",
    paddingBottom: "3px"
  },

  logout: {
    background: "linear-gradient(135deg,#ef4444,#b91c1c)",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s"
  },

  content: {
    flex: 1,
    padding: "25px",
    background: "linear-gradient(135deg,#f1f5f9,#e2e8f0)"
  }
};