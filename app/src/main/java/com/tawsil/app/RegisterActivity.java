package com.tawsil.app;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.tawsil.app.databinding.ActivityRegisterBinding;

public class RegisterActivity extends AppCompatActivity {

    private ActivityRegisterBinding b;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        b = ActivityRegisterBinding.inflate(getLayoutInflater());
        setContentView(b.getRoot());

        b.btnRegister.setOnClickListener(v -> doRegister());
        b.tvGoLogin.setOnClickListener(v -> finish());
    }

    private void doRegister() {
        String name = b.etName.getText().toString().trim();
        String phone = b.etPhone.getText().toString().trim();
        String email = b.etEmail.getText().toString().trim();
        String pass = b.etPassword.getText().toString().trim();
        String role = b.rbLivreur.isChecked() ? "livreur" : "client";

        if (TextUtils.isEmpty(name) || TextUtils.isEmpty(phone)
                || TextUtils.isEmpty(email) || TextUtils.isEmpty(pass)) {
            Toast.makeText(this, "عمر الحقول باش تكمل", Toast.LENGTH_SHORT).show();
            return;
        }
        if (pass.length() < 6) {
            Toast.makeText(this, "كلمة السر لازمها 6 حروف على الأقل", Toast.LENGTH_SHORT).show();
            return;
        }

        setLoading(true);
        FirebaseUtil.auth().createUserWithEmailAndPassword(email, pass)
                .addOnSuccessListener(result -> {
                    String uid = result.getUser().getUid();
                    User user = new User(uid, name, phone, email, role);
                    FirebaseUtil.db().collection(FirebaseUtil.COL_USERS)
                            .document(uid)
                            .set(user)
                            .addOnSuccessListener(unused -> {
                                setLoading(false);
                                routeAfterRegister(role);
                            })
                            .addOnFailureListener(e -> {
                                setLoading(false);
                                Toast.makeText(this, "تم إنشاء الحساب لكن فشل حفظ البيانات: " + e.getMessage(), Toast.LENGTH_LONG).show();
                            });
                })
                .addOnFailureListener(e -> {
                    setLoading(false);
                    Toast.makeText(this, "فشل إنشاء الحساب: " + e.getMessage(), Toast.LENGTH_LONG).show();
                });
    }

    private void routeAfterRegister(String role) {
        Intent intent;
        if (role.equals("livreur")) {
            intent = new Intent(this, LivreurHomeActivity.class);
        } else {
            intent = new Intent(this, ClientHomeActivity.class);
        }
        startActivity(intent);
        finish();
    }

    private void setLoading(boolean loading) {
        b.progressBar.setVisibility(loading ? View.VISIBLE : View.GONE);
        b.btnRegister.setEnabled(!loading);
    }
}
