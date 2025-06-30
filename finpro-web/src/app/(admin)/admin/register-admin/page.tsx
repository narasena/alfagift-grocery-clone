"use client";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import instance from "../../../../utils/axiosinstance";
import { toast } from "react-toastify";
import { registeValidationAdminSchema } from "../../../(user)/features/register/schemas/adminRegisterValidationSchema";
import authStore from "../../../../zustand/authStore";
import { useRouter } from "next/navigation";

interface Store {
  id: string;
  name: string;
  city: string;
  // Add other store properties if needed
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  storeId: string;
  role: string;
  avatarImgUrl: string;
}

export default function RegisterStoreAdminPage() {
  const router = useRouter();
  const role = authStore.getState().role;

  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "SuperAdmin") {
      toast.error("Akses ditolak: Hanya SuperAdmin yang dapat mengakses fitur ini");
      router.push("/dashboard");
    }
  }, [role, router]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = authStore.getState().token;

        const res = await instance.get("/store/all-store", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStores(res.data);
      } catch (error) {
        console.error("Failed to fetch stores", error);
        toast.error("Failed to load stores");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleSubmit = async (values: FormValues) => {
    try {
      const token = authStore.getState().token;

      const res = await instance.post("/admins/register-admin", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 text-black">
      <h1 className="text-xl font-semibold mb-4">Register Store Admin</h1>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phoneNumber: "",
          storeId: "",
          role: "",
          avatarImgUrl: "",
        }}
        validationSchema={registeValidationAdminSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block mb-1">First Name</label>
              <Field name="firstName" className="w-full px-4 py-2 border rounded-md" />
              <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block mb-1">Last Name</label>
              <Field name="lastName" className="w-full px-4 py-2 border rounded-md" />
              <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <Field name="email" type="email" className="w-full px-4 py-2 border rounded-md" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block mb-1">Password</label>
              <Field name="password" type="password" className="w-full px-4 py-2 border rounded-md" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block mb-1">Role</label>
              <Field
                as="select"
                name="role"
                className="select select-bordered w-full px-4 py-2 border-black rounded-md bg-white"
              >
                <option value="" disabled>
                  Select Employee Role
                </option>
                <option value="Admin">Admin</option>
                <option value="SuperAdmin">Super Admin</option>
              </Field>
              <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block mb-1">Phone Number</label>
              <Field name="phoneNumber" type="phoneNumber" className="w-full px-4 py-2 border rounded-md" />
              <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block mb-1">Assign to Store</label>
              {loading ? (
                <div className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-500">Loading stores...</div>
              ) : (
                <>
                  <Field as="select" name="storeId" className="w-full px-4 py-2 border rounded-md">
                    <option value="fb">Select Store</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name} - {store.city}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="storeId" component="div" className="text-red-500 text-sm mt-1" />
                </>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
