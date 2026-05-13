const { firebaseDB } = require("../Faierbase_Config/index");
const { Filter } = require("firebase-admin/firestore");

class ManageUser {

  // ================= REGISTER =================
  RegisterUser = async (userData) => {
    try {
      const users = firebaseDB.collection("Users");

      // Duplicate Email Check
      const emailCheck = await users
        .where("Email", "==", userData.Email)
        .get();

      if (!emailCheck.empty) {
        return { Status: "Fail", Data: "Email already registered" };
      }

      const newUser = {
        Name: userData.Name,
        Email: userData.Email,
        Password: userData.Password, // ⚠ bcrypt later
        Phone: userData.Phone,
        Address: userData.Address,
        CreatedDate: new Date().toISOString(),
      };

      const docRef = await users.add(newUser);

      return {
        Status: "OK",
        Data: "User registered successfully",
        UserId: docRef.id,
      };
    } catch (err) {
      console.log(err);
      return { Status: "Fail", Data: err.message };
    }
  };

  // ================= LOGIN =================
  LoginUser = async (username, password) => {
    try {
      const users = firebaseDB.collection("Users");

      const snap = await users
        .where(
          Filter.or(
            Filter.where("Email", "==", username),
            Filter.where("Phone", "==", username)
          )
        )
        .where("Password", "==", password)
        .get();

      if (snap.empty) {
        return { Status: "Fail", Data: "Wrong username or password" };
      }

      const u = snap.docs[0];
      return {
        Status: "OK",
        Data: { Id: u.id, User: u.data() },
      };
    } catch (e) {
      console.log(e);
      return { Status: "Fail", Data: "Something went wrong" };
    }
  };

  // ================= GET ALL USERS =================
  GetAllUsers = async () => {
    try {
      const snap = await firebaseDB.collection("Users").get();
      return {
        Status: "OK",
        Data: snap.docs.map(d => ({ Id: d.id, User: d.data() })),
      };
    } catch (e) {
      return { Status: "Fail", Data: e.message };
    }
  };

  // ================= GET USER BY ID =================
  GetUserById = async (id) => {
    try {
      const snap = await firebaseDB.collection("Users").doc(id).get();

      if (!snap.exists) {
        return { Status: "Fail", Data: "User not found" };
      }

      return {
        Status: "OK",
        Data: { Id: snap.id, User: snap.data() },
      };
    } catch (e) {
      return { Status: "Fail", Data: e.message };
    }
  };

  // ================= UPDATE USER =================
  UpdateUser = async (id, userData) => {
    try {
      await firebaseDB.collection("Users").doc(id).update(userData);
      return { Status: "OK", Data: "User updated successfully" };
    } catch (e) {
      return { Status: "Fail", Data: e.message };
    }
  };

  // ================= DELETE USER =================
  DeleteUser = async (id) => {
    try {
      await firebaseDB.collection("Users").doc(id).delete();
      return { Status: "OK", Data: "User deleted successfully" };
    } catch (e) {
      return { Status: "Fail", Data: e.message };
    }
  };

  // ================= CHANGE PASSWORD =================
  ChangePassword = async (userId, oldPassword, newPassword) => {
    try {
      const userRef = firebaseDB.collection("Users").doc(userId);
      const snap = await userRef.get();

      if (!snap.exists)
        return { Status: "Fail", Data: "User not found" };

      if (snap.data().Password !== oldPassword)
        return { Status: "Fail", Data: "Old password incorrect" };

      if (newPassword.length < 5)
        return { Status: "Fail", Data: "Password too short" };

      await userRef.update({ Password: newPassword });

      return { Status: "OK", Data: "Password updated successfully" };
    } catch (e) {
      return { Status: "Fail", Data: e.message };
    }
  };
}

module.exports = new ManageUser();
