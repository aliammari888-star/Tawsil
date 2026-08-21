package com.tawsil.app;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import com.google.firebase.firestore.QuerySnapshot;
import com.tawsil.app.databinding.ActivityLivreurHomeBinding;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class LivreurHomeActivity extends AppCompatActivity {

    private ActivityLivreurHomeBinding b;
    private OrderAdapter adapter;
    private boolean showingAvailable = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        b = ActivityLivreurHomeBinding.inflate(getLayoutInflater());
        setContentView(b.getRoot());

        adapter = new OrderAdapter(order -> {
            Intent i = new Intent(this, OrderDetailActivity.class);
            i.putExtra("order", order);
            startActivity(i);
        });
        b.recyclerView.setLayoutManager(new LinearLayoutManager(this));
        b.recyclerView.setAdapter(adapter);

        b.swipeRefresh.setOnRefreshListener(this::loadData);
        b.btnTabAvailable.setOnClickListener(v -> switchTab(true));
        b.btnTabMine.setOnClickListener(v -> switchTab(false));
        b.tvLogout.setOnClickListener(v -> {
            FirebaseUtil.auth().signOut();
            startActivity(new Intent(this, LoginActivity.class));
            finish();
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        loadData();
    }

    private void switchTab(boolean available) {
        showingAvailable = available;
        b.btnTabAvailable.setBackgroundTintList(getColorStateList(
                available ? R.color.primary : R.color.text_gray));
        b.btnTabMine.setBackgroundTintList(getColorStateList(
                available ? R.color.text_gray : R.color.primary));
        loadData();
    }

    private void loadData() {
        b.swipeRefresh.setRefreshing(true);
        if (showingAvailable) {
            FirebaseUtil.db().collection(FirebaseUtil.COL_ORDERS)
                    .whereEqualTo("status", Order.STATUS_PENDING)
                    .get()
                    .addOnSuccessListener(this::onLoaded)
                    .addOnFailureListener(this::onError);
        } else {
            String uid = FirebaseUtil.currentUid();
            FirebaseUtil.db().collection(FirebaseUtil.COL_ORDERS)
                    .whereEqualTo("livreurId", uid)
                    .get()
                    .addOnSuccessListener(this::onLoaded)
                    .addOnFailureListener(this::onError);
        }
    }

    private void onLoaded(QuerySnapshot snapshot) {
        b.swipeRefresh.setRefreshing(false);
        List<Order> orders = new ArrayList<>();
        for (var doc : snapshot.getDocuments()) {
            Order o = doc.toObject(Order.class);
            o.id = doc.getId();
            orders.add(o);
        }
        // ترتيب الأحدث أولاً (نتفادى الحاجة لـ composite index هنا)
        orders.sort((a, c) -> Long.compare(c.createdAt, a.createdAt));
        adapter.setItems(orders);
        b.tvEmpty.setVisibility(orders.isEmpty() ? View.VISIBLE : View.GONE);
    }

    private void onError(Exception e) {
        b.swipeRefresh.setRefreshing(false);
        Toast.makeText(this, "خطأ: " + e.getMessage(), Toast.LENGTH_LONG).show();
    }
}
