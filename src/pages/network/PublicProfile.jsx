// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../../services/api";

// export default function PublicProfile() {
//   const { id } = useParams();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const res = await api.get(`/alumni/user/${id}`);
//       setUser(res.data);
//     };

//     fetchUser();
//   }, [id]);

//   if (!user) return <p>Chargement...</p>;

//   const profile = user.profile;

//   // ✅ photo logic
//   const photoUrl = profile?.photo
//     ? `http://127.0.0.1:8000/storage/${profile.photo}`
//     : null;

//   return (
//     <>
//       <style>{`
//         body {
//           margin: 0;
//           font-family: Inter, sans-serif;
//           background: #f4f6f9;
//         }

//         .container {
//           max-width: 900px;
//           margin: 40px auto;
//           padding: 20px;
//         }

//         .card {
//           background: #fff;
//           border-radius: 16px;
//           box-shadow: 0 6px 25px rgba(0,0,0,0.08);
//           padding: 25px;
//         }

//         .header {
//           display: flex;
//           gap: 20px;
//           align-items: center;
//           margin-bottom: 20px;
//         }

//         .photoContainer {
//           width: 120px;
//           height: 120px;
//           border-radius: 50%;
//           overflow: hidden;
//           border: 3px solid #1e3a8a;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: #eee;
//         }

//         .photo {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .avatarFallback {
//           width: 100%;
//           height: 100%;
//           background: #1e3a8a;
//           color: #fff;
//           font-size: 40px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: bold;
//         }

//         .name {
//           font-size: 22px;
//           font-weight: bold;
//           margin: 0;
//         }

//         .email {
//           color: #666;
//           margin-top: 5px;
//         }

//         .infoGrid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 15px;
//           margin-top: 20px;
//         }

//         .box {
//           background: #f9fafb;
//           padding: 12px;
//           border-radius: 10px;
//         }

//         .label {
//           font-size: 13px;
//           color: #555;
//         }

//         .value {
//           font-weight: 600;
//           margin-top: 5px;
//         }
//       `}</style>

//       <div className="container">
//         <div className="card">

//           {/* HEADER */}
//           <div className="header">
//             <div className="photoContainer">
//               {photoUrl ? (
//                 <img src={photoUrl} className="photo" />
//               ) : (
//                 <div className="avatarFallback">
//                   {user.first_name?.charAt(0)?.toUpperCase()}
//                 </div>
//               )}
//             </div>

//             <div>
//               <h2 className="name">
//                 {user.first_name} {user.last_name}
//               </h2>
//               <p className="email">{user.email}</p>
//             </div>
//           </div>

//           {/* INFOS */}
//           <div className="infoGrid">

//             <div className="box">
//               <div className="label">Année de graduation</div>
//               <div className="value">{profile?.graduation_year || "-"}</div>
//             </div>

//             <div className="box">
//               <div className="label">Niveau</div>
//               <div className="value">{profile?.degree_level || "-"}</div>
//             </div>

//             <div className="box">
//               <div className="label">Statut</div>
//               <div className="value">{profile?.status || "-"}</div>
//             </div>

//             <div className="box">
//               <div className="label">Poste</div>
//               <div className="value">{profile?.job_title || "-"}</div>
//             </div>

//             <div className="box">
//               <div className="label">Promotion</div>
//               <div className="value">{profile?.promotion || "-"}</div>
//             </div>

//             <div className="box">
//               <div className="label">Filière</div>
//               <div className="value">
//                 {profile?.filiere?.name || "-"}
//               </div>
//             </div>

//           </div>

//         </div>
//       </div>
//     </>
//   );
// }