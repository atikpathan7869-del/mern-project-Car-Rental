import { useFormik } from "formik";
import * as Yup from "yup";
import { chnagePasswordRequest } from "../../services/api";
export default function ChangePassword() {
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string()
        .required("Current password is required")
        .min(6, "Must be at least 6 characters"),
      newPassword: Yup.string()
        .required("New password is required")
        .min(6, "Must be at least 6 characters"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const adminId = localStorage.getItem("AdminId");
        const response = await chnagePasswordRequest({
          userId: adminId,
          oldPassword: values.currentPassword,
          newPassword: values.newPassword,
        });

        alert(response.data.Data); // show backend response message
        resetForm();
      } catch (error) {
        alert(error.response?.data?.Data || "Failed to change password");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="mb-4">Change Password</h3>
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className={`form-control ${
                      formik.touched.currentPassword && formik.errors.currentPassword
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("currentPassword")}
                    placeholder="Enter current password"
                  />
                  {formik.touched.currentPassword && formik.errors.currentPassword && (
                    <div className="invalid-feedback">{formik.errors.currentPassword}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className={`form-control ${
                      formik.touched.newPassword && formik.errors.newPassword
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("newPassword")}
                    placeholder="Enter new password"
                  />
                  {formik.touched.newPassword && formik.errors.newPassword && (
                    <div className="invalid-feedback">{formik.errors.newPassword}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className={`form-control ${
                      formik.touched.confirmPassword && formik.errors.confirmPassword
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("confirmPassword")}
                    placeholder="Confirm new password"
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="invalid-feedback">{formik.errors.confirmPassword}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={formik.isSubmitting}
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
