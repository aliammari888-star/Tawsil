package com.tawsil.app;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;

public class FirebaseUtil {

    public static final String COL_USERS = "users";
    public static final String COL_ORDERS = "orders";

    private static FirebaseFirestore firestore;

    public static FirebaseAuth auth() {
        return FirebaseAuth.getInstance();
    }

    public static FirebaseFirestore db() {
        if (firestore == null) {
            firestore = FirebaseFirestore.getInstance();
        }
        return firestore;
    }

    public static String currentUid() {
        if (auth().getCurrentUser() == null) return null;
        return auth().getCurrentUser().getUid();
    }

    public interface UserCallback {
        void onResult(User user);
        void onError(Exception e);
    }

    /** يجيب بيانات المستخدم الحالي (بما فيها role) من Firestore */
    public static void fetchCurrentUser(UserCallback callback) {
        String uid = currentUid();
        if (uid == null) {
            callback.onError(new Exception("لا يوجد مستخدم مسجل دخول"));
            return;
        }
        db().collection(COL_USERS).document(uid).get()
                .addOnSuccessListener(doc -> {
                    if (doc.exists()) {
                        User user = doc.toObject(User.class);
                        callback.onResult(user);
                    } else {
                        callback.onError(new Exception("بيانات المستخدم غير موجودة"));
                    }
                })
                .addOnFailureListener(callback::onError);
    }
}
