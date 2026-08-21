package com.tawsil.app;

import java.io.Serializable;

/**
 * نموذج المستخدم — يُخزّن في مجموعة "users" في Firestore.
 * role يمكن أن تكون: "client" أو "livreur" أو "admin"
 */
public class User implements Serializable {
    public String uid;
    public String name;
    public String phone;
    public String email;
    public String role;
    public long createdAt;

    public User() {
        // مطلوب فارغ constructor لـ Firestore
    }

    public User(String uid, String name, String phone, String email, String role) {
        this.uid = uid;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.role = role;
        this.createdAt = System.currentTimeMillis();
    }
}
