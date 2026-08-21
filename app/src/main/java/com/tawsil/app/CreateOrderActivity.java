package com.tawsil.app;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.tawsil.app.databinding.ActivityCreateOrderBinding;

public class CreateOrderActivity extends AppCompatActivity {

    private ActivityCreateOrderBinding b;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        b = ActivityCreateOrderBinding.inflate(getLayoutInflater());
        setContentView(b.getRoot());

        b.btnSubmit.setOnClickListener(v -> submit());
    }

    private void submit() {
        String pickup = b.etPickup.getText().toString().trim();
        String drop = b.etDrop.getText().toString().trim();
        String desc = b.etDescription.getText().toString().trim();
        String priceStr = b.etPrice.getText().toString().trim();

        if (TextUtils.isEmpty(pickup) || TextUtils.isEmpty(drop) || TextUtils.isEmpty(priceStr)) {
            Toast.makeText(this, "عمر عنوان الاستلام، التوصيل، والسعر", Toast.LENGTH_SHORT).show();
            return;
        }

        double price;
        try {
            price = Double.parseDouble(priceStr);
        } catch (NumberFormatException e) {
            Toast.makeText(this, "السعر لازم يكون رقم صحيح", Toast.LENGTH_SHORT).show();
            return;
        }

        String uid = FirebaseUtil.currentUid();
        if (uid == null) return;

        setLoading(true);
        FirebaseUtil.fetchCurrentUser(new FirebaseUtil.UserCallback() {
            @Override
            public void onResult(User user) {
                Order order = new Order(uid, user.name, user.phone, pickup, drop, desc, price);
                FirebaseUtil.db().collection(FirebaseUtil.COL_ORDERS)
                        .add(order)
                        .addOnSuccessListener(ref -> {
                            setLoading(false);
                            Toast.makeText(CreateOrderActivity.this, "تم إرسال الطلب بنجاح", Toast.LENGTH_SHORT).show();
                            finish();
                        })
                        .addOnFailureListener(e -> {
                            setLoading(false);
                            Toast.makeText(CreateOrderActivity.this, "فشل إرسال الطلب: " + e.getMessage(), Toast.LENGTH_LONG).show();
                        });
            }

            @Override
            public void onError(Exception e) {
                setLoading(false);
                Toast.makeText(CreateOrderActivity.this, "تعذر جلب بيانات المستخدم", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void setLoading(boolean loading) {
        b.progressBar.setVisibility(loading ? View.VISIBLE : View.GONE);
        b.btnSubmit.setEnabled(!loading);
    }
}
