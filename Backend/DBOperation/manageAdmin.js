const { firebaseDB } = require("../Faierbase_Config/index");

class ManageAdmin {
  // Helper: Firestore Counter for Auto Increment _id
  async getNextSequence(name) {
    const counterRef = firebaseDB.collection("Counters").doc(name);
    const counterDoc = await counterRef.get();

    let nextId = 1;
    if (counterDoc.exists) {
      nextId = counterDoc.data().seq + 1;
    }

    await counterRef.set({ seq: nextId });
    return nextId;
  }

  // CREATE: Register Admin
  RegisterAdmin = async (adminData) => {
    try {
      const adminRef = firebaseDB.collection("Admins");

      // Duplicate Email Check
      const emailSnap = await adminRef.where("Email", "==", adminData.Email).get();
      if (!emailSnap.empty) {
        return { Data: "Email already registered", Status: "Fail" };
      }

      const newId = await this.getNextSequence("adminCounter");

      const newAdmin = {
        _id: newId,
        Email: adminData.Email,
        Password: adminData.Password, // plain text
        Role: "admin",
        CreatedDate: new Date().toISOString(),
      };

      const doc = await adminRef.add(newAdmin);

      return {
        Data: "Admin Registration Successful",
        AdminId: newAdmin._id,
        FirestoreId: doc.id,
        Status: "Ok",
      };
    } catch (err) {
      console.error("Error registering admin:", err);
      return { Data: err.message, Status: "Fail" };
    }
  };

  // LOGIN: Authenticate Admin (Email)
  LoginAdmin = async (loginData) => {
    try {
      const adminRef = firebaseDB.collection("Admins");

      const adminSnap = await adminRef
        .where("Email", "==", loginData.Email)
        .where("Password", "==", loginData.Password)
        .get();

      if (adminSnap.empty) {
        return { Data: "Invalid Email or Password", Status: "Fail" };
      }

      let admin = null;
      adminSnap.forEach(doc => {
        admin = { Id: doc.id, Admin: doc.data() };
      });

      return {
        Data: "Login Successful",
        AdminId: admin.Admin._id,
        Email: admin.Admin.Email,
        Role: admin.Admin.Role,
        FirestoreId: admin.Id,
        Status: "Ok",
      };
    } catch (err) {
      return { Data: err.message, Status: "Fail" };
    }
  };

  // READ: Get All Admins
  GetAllAdmins = async () => {
    try {
      const snapshot = await firebaseDB.collection("Admins").get();
      const admins = snapshot.docs.map(doc => ({
        FirestoreId: doc.id,
        Admin: doc.data(),
      }));

      return { Data: admins, Status: "Ok" };
    } catch (err) {
      return { Data: err.message, Status: "Fail" };
    }
  };

  // READ: Get Admin By _id or Firestore Doc ID
  GetAdminById = async (id) => {
    try {
      const doc = await firebaseDB.collection("Admins").doc(id).get();
      if (doc.exists) return { Data: doc.data(), Status: "Ok" };

      const snap = await firebaseDB.collection("Admins").where("_id", "==", parseInt(id)).get();
      if (snap.empty) return { Data: "Admin Not Found", Status: "Fail" };

      let admin = null;
      snap.forEach(d => admin = { FirestoreId: d.id, Admin: d.data() });

      return { Data: admin, Status: "Ok" };
    } catch (err) {
      return { Data: err.message, Status: "Fail" };
    }
  };

  // UPDATE: Update Admin
  UpdateAdmin = async (id, adminData) => {
    try {
      const adminRef = firebaseDB.collection("Admins");

      const doc = await adminRef.doc(id).get();
      if (doc.exists) {
        await adminRef.doc(id).update({ ...adminData, UpdatedDate: new Date().toISOString() });
        return { Data: "Admin Updated Successfully", Status: "Ok" };
      }

      const snap = await adminRef.where("_id", "==", parseInt(id)).get();
      if (snap.empty) return { Data: "Admin Not Found", Status: "Fail" };

      let docId = null;
      snap.forEach(d => docId = d.id);

      await adminRef.doc(docId).update({ ...adminData, UpdatedDate: new Date().toISOString() });

      return { Data: "Admin Updated Successfully", Status: "Ok" };
    } catch (err) {
      return { Data: err.message, Status: "Fail" };
    }
  };

  // CHANGE PASSWORD
  ChangeAdminPassword = async (data) => {
    try {
      const adminRef = firebaseDB.collection("Admins");

      const snap = await adminRef.where("_id", "==", parseInt(data.id)).get();
      if (snap.empty) return { Data: "Admin not found", Status: "Fail" };

      let admin = null;
      let docId = null;

      snap.forEach(doc => {
        admin = doc.data();
        docId = doc.id;
      });

      if (admin.Password !== data.oldPassword) {
        return { Data: "Current password is incorrect", Status: "Fail" };
      }

      await adminRef.doc(docId).update({ Password: data.newPassword, UpdatedDate: new Date().toISOString() });

      return { Data: "Password changed successfully", Status: "Ok" };
    } catch (err) {
      return { Data: err.message, Status: "Fail" };
    }
  };

  // DELETE: Delete Admin
  DeleteAdmin = async (id) => {
    try {
      const adminRef = firebaseDB.collection("Admins");

      const doc = await adminRef.doc(id).get();
      if (doc.exists) {
        await adminRef.doc(id).delete();
        return { Data: "Admin Deleted Successfully", Status: "Ok" };
      }

      const snap = await adminRef.where("_id", "==", parseInt(id)).get();
      if (snap.empty) return { Data: "Admin Not Found", Status: "Fail" };

      let docId = null;
      snap.forEach(d => docId = d.id);

      await adminRef.doc(docId).delete();

      return { Data: "Admin Deleted Successfully", Status: "Ok" };
    } catch (err) {
      return { Data: err.message, Status: "Fail" };
    }
  };
}

module.exports = new ManageAdmin();
