package com.tawsil.app;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        new Handler().postDelayed(this::routeUser, 800);
    }

    private void routeUser() {
        if (FirebaseUtil.currentUid() == null) {
            startActivity(new Intent(this, LoginActivity.class));
            finish();
            return;
        }

        FirebaseUtil.fetchCurrentUser(new FirebaseUtil.UserCallback() {
            @Override
            public void onResult(User user) {
                openHomeForRole(user);
            }

            @Override
            public void onError(Exception e) {
                Toast.makeText(SplashActivity.this, "تعذر التحقق من الحساب، سجل الدخول من جديد", Toast.LENGTH_SHORT).show();
                FirebaseUtil.auth().signOut();
                startActivity(new Intent(SplashActivity.this, LoginActivity.class));
                finish();
            }
        });
    }

    private void openHomeForRole(User user) {
        Intent intent;
        if (user == null || user.role == null) {
            intent = new Intent(this, LoginActivity.class);
        } else if (user.role.equals("admin")) {
            intent = new Intent(this, AdminHomeActivity.class);
        } else if (user.role.equals("livreur")) {
            intent = new Intent(this, LivreurHomeActivity.class);
        } else {
            intent = new Intent(this, ClientHomeActivity.class);
        }
        startActivity(intent);
        finish();
    }
}
