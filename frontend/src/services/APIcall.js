import { getAuth, onAuthStateChanged } from "firebase/auth";

async function makeRequest(url, method, body) {
  const auth = getAuth();
  let data = { status: "error", msg: "" };
  // Return a promise that resolves when auth state is ready
  return new Promise((resolve) => {
    // This listener fires once when auth state is first determined
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Stop listening immediately after first auth state is determined
      if (user) {
        const idToken = await user.getIdToken();
        const isFormData = body instanceof FormData;
        const req = {
          method: method,
          headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            Authorization: `Bearer ${idToken}`,
          },
        };
        if (body) {
          req.body = isFormData ? body : JSON.stringify(body);
        }
        const response = await fetch(url, req);
        if (response.ok || response.status === 304) {
          data = await response.json();
        } else if (response.status === 409) {
          data.msg = "overlap";
          data.res = await response.json();
        } else {
          data.msg = "Failed to make request";
        }
      } else {
        data.msg = "User not logged in";
      }
      resolve(data);
    });
  });
}

export default makeRequest;
