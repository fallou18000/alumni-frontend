import { motion } from "framer-motion";
import image3 from "../../assets/image3.jpeg";

export default function About() {

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.18,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1 },
  };

  const cards = [
    { icon: "🎓", title: "Objectif", text: "Valoriser les parcours des anciens étudiants et créer un réseau solide." },
    { icon: "🌍", title: "Communauté", text: "Un espace d’échange entre étudiants et entreprises partenaires." },
   
  ];

  return (
    <div style={styles.page}>

      {/* BACKGROUND LIGHT BLURS */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>
      <div style={styles.blob3}></div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={styles.wrapper}
      >

        {/* HERO */}
        <motion.div variants={fadeUp} style={styles.hero}>

          {/* TEXT */}
          <div>

            <div style={styles.badge}>✨ Reseaux des alumnis</div>

            <h1 style={styles.title}>
              Connecter les talents,<br />
              construire l’avenir
            </h1>

            <p style={styles.text}>
              Une plateforme moderne pour connecter les anciens étudiants,
              valoriser les parcours et créer un réseau puissant entre université et monde professionnel.
            </p>

            <div style={styles.button}>
              Explorer le réseau
            </div>

          </div>

          {/* IMAGE */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 120 }}
            style={styles.imageBox}
          >
            <img src={image3} style={styles.image} />
            <div style={styles.overlay}></div>

            <div style={styles.tag}>
              Réseau mondial 🌍
            </div>
          </motion.div>

        </motion.div>

        {/* CARDS */}
        <div style={styles.grid}>
          {cards.map((c, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -10, scale: 1.04 }}
              style={styles.card}
            >
              <div style={styles.icon}>{c.icon}</div>
              <h3 style={styles.cardTitle}>{c.title}</h3>
              <p style={styles.cardText}>{c.text}</p>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </div>
  );
}

/* ===================== STYLE ULTRA MODERNE ===================== */

const styles = {

  page: {
    minHeight: "100vh",
    padding: 60,
    background: "#f8fafc",
    position: "relative",
    overflow: "auto",
    fontFamily: "'Inter', sans-serif",
  },

  blob1: {
    position: "absolute",
    width: 520,
    height: 520,
    background: "radial-gradient(circle, rgba(59,130,246,0.25), transparent 60%)",
    top: -160,
    right: -160,
    filter: "blur(100px)",
  },

  blob2: {
    position: "absolute",
    width: 520,
    height: 520,
    background: "radial-gradient(circle, rgba(139,92,246,0.22), transparent 60%)",
    bottom: -160,
    left: -160,
    filter: "blur(110px)",
  },

  blob3: {
    position: "absolute",
    width: 420,
    height: 420,
    background: "radial-gradient(circle, rgba(16,185,129,0.18), transparent 60%)",
    top: "45%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    filter: "blur(120px)",
  },

  wrapper: {
    maxWidth: 1200,
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 50,
  },

  /* HERO */
  hero: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: 50,
    alignItems: "center",
  },

  badge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.8)",
    border: "1px solid #e2e8f0",
    fontSize: 12,
    marginBottom: 16,
    backdropFilter: "blur(10px)",
  },

  title: {
    fontSize: 46,
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: 18,
    background: "linear-gradient(90deg,#0f172a,#2563eb,#7c3aed)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  text: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 1.9,
    marginBottom: 22,
    maxWidth: 520,
  },

  button: {
    display: "inline-block",
    padding: "12px 20px",
    borderRadius: 14,
    background: "linear-gradient(135deg,#2563eb,#7c3aed)",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 15px 35px rgba(37,99,235,0.25)",
  },

  /* IMAGE */
  imageBox: {
    position: "relative",
    borderRadius: 26,
    overflow: "hidden",
    height: 400,
    boxShadow: "0 30px 70px rgba(0,0,0,0.10)",
    border: "1px solid #e2e8f0",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(15,23,42,0.4), transparent)",
  },

  tag: {
    position: "absolute",
    bottom: 18,
    left: 18,
    background: "rgba(255,255,255,0.9)",
    padding: "7px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
  },

  /* CARDS */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
  },

  card: {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(14px)",
    borderRadius: 22,
    padding: 26,
    border: "1px solid #e2e8f0",
    boxShadow: "0 12px 35px rgba(0,0,0,0.06)",
    transition: "0.3s",
  },

  icon: {
    fontSize: 28,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: 700,
    marginBottom: 8,
    color: "#0f172a",
  },

  cardText: {
    fontSize: 13.5,
    color: "#64748b",
    lineHeight: 1.7,
  },
};