package com.tawsil.app;

import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.tawsil.app.databinding.ActivityOrderDetailBinding;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class OrderDetailActivity extends AppCompatActivity {

    private ActivityOrderDetailBinding b;
    private Order order;
    private String myRole;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        b = ActivityOrderDetailBinding.inflate(getLayoutInflater());
        setContentView(b.getRoot());

        order = (Order) getIntent().getSerializableExtra("order");
        if (order == null) {
            finish();
            return;
        }

        renderOrder();

        FirebaseUtil.fetchCurrentUser(new FirebaseUtil.UserCallback() {
            @Override
            public void onResult(User user) {
                myRole = user.role;
                buildActions();
            }

            @Override
            public void onError(Exception e) {
                // ما نعرضوش أزرار إذا ما قدرناش نجيبو الدور
            }
        });
    }

    private void renderOrder() {
        b.tvDescription.setText(order.description == null || order.description.isEmpty()
                ? "طلب توصيل" : order.description);
        b.tvPickup.setText("📍 من: " + order.pickupAddress);
        b.tvDrop.setText("🎯 إلى: " + order.dropAddress);
        b.tvPrice.setText(String.format(Locale.getDefault(), "السعر: %.3f د.ت", order.price));
        b.tvClient.setText("العميل: " + safe(order.clientName) + " - " + safe(order.clientPhone));
        b.tvLivreur.setText(order.livreurId == null ? "الموصل: غير محدد بعد" : "الموصل: " + safe(order.livreurName));
        b.tvStatus.setText(order.statusLabel());

        int colorRes;
        switch (order.status) {
            case Order.STATUS_ACCEPTED: colorRes = R.color.status_accepted; break;
            case Order.STATUS_PICKED_UP: colorRes = R.color.status_picked_up; break;
            case Order.STATUS_DELIVERED: colorRes = R.color.status_delivered; break;
            case Order.STATUS_CANCELLED: colorRes = R.color.status_cancelled; break;
            default: colorRes = R.color.status_pending;
        }
        GradientDrawable bg = (GradientDrawable) b.tvStatus.getBackground().mutate();
        bg.setColor(getResources().getColor(colorRes));
    }

    private String safe(String s) {
        return s == null || s.isEmpty() ? "-" : s;
    }

    private void buildActions() {
        b.actionsContainer.removeAllViews();
        String uid = FirebaseUtil.currentUid();

        if ("livreur".equals(myRole)) {
            if (Order.STATUS_PENDING.equals(order.status) && order.livreurId == null) {
                addButton("قبول الطلب", v -> acceptOrder());
            } else if (Order.STATUS_ACCEPTED.equals(order.status) && uid.equals(order.livreurId)) {
                addButton("تم استلام الطرد", v -> updateStatus(Order.STATUS_PICKED_UP));
            } else if (Order.STATUS_PICKED_UP.equals(order.status) && uid.equals(order.livreurId)) {
                addButton("تم التوصيل ✅", v -> updateStatus(Order.STATUS_DELIVERED));
            }
        } else if ("client".equals(myRole)) {
            if (Order.STATUS_PENDING.equals(order.status)) {
                addButton("إلغاء الطلب", v -> updateStatus(Order.STATUS_CANCELLED));
            }
        } else if ("admin".equals(myRole)) {
            if (!Order.STATUS_DELIVERED.equals(order.status) && !Order.STATUS_CANCELLED.equals(order.status)) {
                addButton("إلغاء الطلب (أدمن)", v -> updateStatus(Order.STATUS_CANCELLED));
            }
        }
    }

    private void addButton(String text, View.OnClickListener listener) {
        Button btn = new Button(this);
        btn.setText(text);
        btn.setBackgroundTintList(getColorStateList(R.color.primary));
        btn.setTextColor(getResources().getColor(R.color.white));
        android.widget.LinearLayout.LayoutParams params = new android.widget.LinearLayout.LayoutParams(
                android.widget.LinearLayout.LayoutParams.MATCH_PARENT, dp(52));
        params.topMargin = dp(8);
        btn.setLayoutParams(params);
        btn.setOnClickListener(listener);
        b.actionsContainer.addView(btn);
    }

    private int dp(int value) {
        return (int) (value * getResources().getDisplayMetrics().density);
    }

    private void acceptOrder() {
        String uid = FirebaseUtil.currentUid();
        FirebaseUtil.fetchCurrentUser(new FirebaseUtil.UserCallback() {
            @Override
            public void onResult(User user) {
                Map<String, Object> updates = new HashMap<>();
                updates.put("status", Order.STATUS_ACCEPTED);
                updates.put("livreurId", uid);
                updates.put("livreurName", user.name);
                FirebaseUtil.db().collection(FirebaseUtil.COL_ORDERS).document(order.id)
                        .update(updates)
                        .addOnSuccessListener(unused -> {
                            order.status = Order.STATUS_ACCEPTED;
                            order.livreurId = uid;
                            order.livreurName = user.name;
                            renderOrder();
                            buildActions();
                            Toast.makeText(OrderDetailActivity.this, "تم قبول الطلب", Toast.LENGTH_SHORT).show();
                        })
                        .addOnFailureListener(e ->
                                Toast.makeText(OrderDetailActivity.this, "فشل: " + e.getMessage(), Toast.LENGTH_LONG).show());
            }

            @Override
            public void onError(Exception e) {
                Toast.makeText(OrderDetailActivity.this, "تعذر جلب بياناتك", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void updateStatus(String newStatus) {
        FirebaseUtil.db().collection(FirebaseUtil.COL_ORDERS).document(order.id)
                .update("status", newStatus)
                .addOnSuccessListener(unused -> {
                    order.status = newStatus;
                    renderOrder();
                    buildActions();
                    Toast.makeText(this, "تم تحديث الحالة", Toast.LENGTH_SHORT).show();
                })
                .addOnFailureListener(e ->
                        Toast.makeText(this, "فشل التحديث: " + e.getMessage(), Toast.LENGTH_LONG).show());
    }
}
