package com.tawsil.app;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.tawsil.app.databinding.ActivityLoginBinding;

public class LoginActivity extends AppCompatActivity {

    private ActivityLoginBinding b;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        b = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(b.getRoot());

        b.btnLogin.setOnClickListener(v -> doLogin());
        b.tvGoRegister.setOnClickListener(v ->
                startActivity(new Intent(this, RegisterActivity.class)));
    }

    private void doLogin() {
        String email = b.etEmail.getText().toString().trim();
        String pass = b.etPassword.getText().toString().trim();

        if (TextUtils.isEmpty(email) || TextUtils.isEmpty(pass)) {
            Toast.makeText(this, "عمر الحقول باش تكمل", Toast.LENGTH_SHORT).show();
            return;
        }

        setLoading(true);
        FirebaseUtil.auth().signInWithEmailAndPassword(email, pass)
                .addOnSuccessListener(result -> {
                    FirebaseUtil.fetchCurrentUser(new FirebaseUtil.UserCallback() {
                        @Override
                        public void onResult(User user) {
                            setLoading(false);
                            routeAfterLogin(user);
                        }

                        @Override
                        public void onError(Exception e) {
                            setLoading(false);
                            Toast.makeText(LoginActivity.this, "تعذر جلب بيانات الحساب", Toast.LENGTH_SHORT).show();
                        }
                    });
                })
                .addOnFailureListener(e -> {
                    setLoading(false);
                    Toast.makeText(this, "فشل تسجيل الدخول: " + e.getMessage(), Toast.LENGTH_LONG).show();
                });
    }

    private void routeAfterLogin(User user) {
        Intent intent;
        if (user.role.equals("admin")) {
            intent = new Intent(this, AdminHomeActivity.class);
        } else if (user.role.equals("livreur")) {
            intent = new Intent(this, LivreurHomeActivity.class);
        } else {
            intent = new Intent(this, ClientHomeActivity.class);
        }
        startActivity(intent);
        finish();
    }

    private void setLoading(boolean loading) {
        b.progressBar.setVisibility(loading ? View.VISIBLE : View.GONE);
        b.btnLogin.setEnabled(!loading);
    }
}
