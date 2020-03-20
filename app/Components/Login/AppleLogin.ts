import * as firebase from "firebase";
import * as AppleAuthentication from "expo-apple-authentication";

type Result = {
  success?: boolean;
  cancelled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
};

export const signInApple = async (): Promise<Result> => {
  try {
    const nonce = getRandomID();
    const { identityToken } = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME],
      state: nonce
    });

    if (identityToken) {
      const provider = new firebase.auth.OAuthProvider("apple.com");
      const credential = provider.credential(identityToken); // TODO: nonce check process

      firebase
        .auth()
        .signInWithCredential(credential)
        .catch(error => {
          throw new Error(error);
        });
      return { success: true };
    }

    return { cancelled: true };
  } catch (e) {
    if (e.code === "ERR_CANCELED") {
      return { cancelled: true };
    }

    console.warn(e);
    return { error: e };
  }
};

const getRandomID = () => {
  const db = firebase.firestore();
  return db.collection("randomId").doc().id;
};

export const isAvailableSignInWithApple = async (): Promise<boolean> => {
  // return false;
  return await AppleAuthentication.isAvailableAsync();
};
