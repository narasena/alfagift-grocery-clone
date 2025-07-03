"use client";

import { FaUser, FaEnvelope, FaShieldAlt, FaPhone, FaBirthdayCake, FaVenusMars } from "react-icons/fa";
import { useEffect, useState } from "react";
import useAuthStore from "@/zustand/authStore";
import instance from "@/utils/axiosinstance";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface UserProfile {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  phoneNumber?: string | null;
  gender?: "Male" | "Female" | null;
  dateOfBirth?: string | null;
  emailVerified: boolean;
  referralCode: string;
  avatarImgUrl?: string | null;
}

interface ProfileInfoProps {
  userEmail: string | null;
  userId: string | null;
  userRole: "SuperAdmin" | "Admin" | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export default function ProfileInfo({ userEmail, userId, userRole }: ProfileInfoProps) {
  const { email, setEmail } = useAuthStore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // === Tambahan untuk Edit Mode ===
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

 useEffect(() => {
  console.log("Fetching profile for email:", email); // ⬅️ Tambahkan ini

  const fetchUserProfile = async () => {
    if (!email) {
      setError("Email tidak tersedia");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await instance.get<ApiResponse>(`/user/profile`, {
        params: { email },
      });

      console.log("Hasil get profile:", response.data.data); // ⬅️ Tambahkan ini

      setUserProfile(response.data.data);
      setFormData(response.data.data); // Set awal formData
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Gagal mengambil data profil");
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchUserProfile();
}, [email]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
  try {
    if (!email || !userId) return;

    if (formData.email && formData.email !== userProfile?.email) {
      await instance.put("/user/change-email", {
        userId,
        newEmail: formData.email,
      });

      toast.success("Email berhasil diubah. Silakan cek inbox email baru untuk verifikasi.");

      // Set email baru ke zustand
      setEmail(formData.email);

      // Tunggu store update dulu
      await new Promise((r) => setTimeout(r, 100));

      // Refetch profile
      const res = await instance.get<ApiResponse>("/user/profile", {
        params: { email: formData.email },
      });

      console.log("🔥 Profile baru:", res.data.data);

      setUserProfile(res.data.data);
      setFormData(res.data.data);
    } else {
      // Update profil biasa
      await instance.put(`/user/profile/${email}`, formData);
      toast.success("Profil berhasil diperbarui!");

      const res = await instance.get<ApiResponse>(`/user/profile`, {
        params: { email },
      });

      setUserProfile(res.data.data);
      setFormData(res.data.data);
    }

    setIsEditing(false);
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    toast.error(error.response?.data?.message || "Gagal memperbarui profil");
  }
};


  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Informasi Profil</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Informasi Profil</h2>
        <div className="p-4 bg-red-50 rounded-md text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Informasi Profil</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* === Foto Profil === */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-gray-200">
            {userProfile?.avatarImgUrl ? (
              <img src={userProfile.avatarImgUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <FaUser className="text-gray-400 text-4xl" />
              </div>
            )}
          </div>
          <span className="text-sm text-gray-500">Max. 1MB (JPG, PNG, GIF)</span>
        </div>

        {/* === Detail Profil === */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* === Nama Lengkap === */}
            <div className="flex items-start space-x-4">
              <FaUser className="text-gray-400 text-xl mt-1" />
              <div className="w-full">
                <h3 className="text-sm text-gray-500">Nama Lengkap</h3>
                {isEditing ? (
                  <>
                    <input
                      name="firstName"
                      placeholder="Masukkan nama depan"
                      defaultValue={formData.firstName || ""}
                      onChange={handleChange}
                      className={`w-full px-3 py-1 ${
                        isEditing ? "border border-gray-300 rounded" : "border-none bg-transparent"
                      }`}
                    />
                    <input
                      name="lastName"
                      placeholder="Masukkan nama belakang"
                      defaultValue={formData.lastName || ""}
                      onChange={handleChange}
                      className={`w-full mt-2 px-3 py-1 ${
                        isEditing ? "border border-gray-300 rounded" : "border-none bg-transparent"
                      }`}
                    />
                  </>
                ) : (
                  <p className="font-medium">
                    {userProfile?.firstName} {userProfile?.lastName || ""}
                  </p>
                )}
              </div>
            </div>

            {/* === Email === */}
            <div className="flex items-start space-x-4">
              <FaEnvelope className="text-gray-400 text-xl mt-1" />
              <div className="w-full">
                <h3 className="text-sm text-gray-500">Email</h3>
                {isEditing ? (
                  <input
                    name="email"
                    placeholder="Masukkan email baru"
                    defaultValue={formData.email || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  <p className="font-medium">
                    {userProfile?.email}
                    {userProfile?.emailVerified ? (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Terverifikasi
                      </span>
                    ) : (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Belum diverifikasi
                      </span>
                    )}
                  </p>
                )}
                {!userProfile?.emailVerified && !isEditing && (
                  <p className="text-xs text-red-500 mt-1">
                    Email belum diverifikasi. Silakan verifikasi melalui inbox Anda.
                  </p>
                )}
              </div>
            </div>

            {/* === Phone === */}
            <div className="flex items-start space-x-4">
              <FaPhone className="text-gray-400 text-xl mt-1" />
              <div className="w-full">
                <h3 className="text-sm text-gray-500">Nomor Telepon</h3>
                {isEditing ? (
                  <input
                    name="phoneNumber"
                    placeholder="Masukkan nomor telepon"
                    defaultValue={formData.phoneNumber || ""}
                    onChange={handleChange}
                    className={`w-full px-3 py-1 ${
                      isEditing ? "border border-gray-300 rounded" : "border-none bg-transparent"
                    }`}
                  />
                ) : (
                  <p className="font-medium">{userProfile?.phoneNumber || "-"}</p>
                )}
              </div>
            </div>

            {/* === Gender === */}
            <div className="flex items-start space-x-4">
              <FaVenusMars className="text-gray-400 text-xl mt-1" />
              <div className="w-full">
                <h3 className="text-sm text-gray-500">Jenis Kelamin</h3>
                {isEditing ? (
                  <select name="gender" value={formData.gender || ""} onChange={handleChange} className="input-class">
                    <option value="">Pilih</option>
                    <option value="Male">Laki-laki</option>
                    <option value="Female">Perempuan</option>
                  </select>
                ) : (
                  <p className="font-medium">{userProfile?.gender || "-"}</p>
                )}
              </div>
            </div>

            {/* === Date of Birth === */}
            <div className="flex items-start space-x-4">
              <FaBirthdayCake className="text-gray-400 text-xl mt-1" />
              <div className="w-full">
                <h3 className="text-sm text-gray-500">Tanggal Lahir</h3>
                {isEditing ? (
                  <input
                    name="dateOfBirth"
                    type="date"
                    defaultValue={formData.dateOfBirth || ""}
                    onChange={handleChange}
                    className={`w-full mt-2 px-3 py-1 ${
                      isEditing ? "border border-gray-300 rounded" : "border-none bg-transparent"
                    }`}
                  />
                ) : (
                  <p className="font-medium">{userProfile?.dateOfBirth || "-"}</p>
                )}
              </div>
            </div>

            {/* === Role === */}
            <div className="flex items-start space-x-4">
              <FaShieldAlt className="text-gray-400 text-xl mt-1" />
              <div>
                <h3 className="text-sm text-gray-500">Role</h3>
                <p className="font-medium">{userRole || "Regular User"}</p>
              </div>
            </div>
          </div>

          {/* === Tombol Action === */}
          <div className="mt-6 flex gap-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit Profil
              </button>
            ) : (
              <>
                <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Simpan
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Batal
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}