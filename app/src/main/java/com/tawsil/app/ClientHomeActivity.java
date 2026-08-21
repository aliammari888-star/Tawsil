package com.tawsil.app;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QuerySnapshot;
import com.tawsil.app.databinding.ActivityClientHomeBinding;
import java.util.ArrayList;
import java.util.List;

public class ClientHomeActivity extends AppCompatActivity {

    private ActivityClientHomeBinding b;
    private OrderAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        b = ActivityClientHomeBinding.inflate(getLayoutInflater());
        setContentView(b.getRoot());

        adapter = new OrderAdapter(order -> {
            Intent i = new Intent(this, OrderDetailActivity.class);
            i.putExtra("order", order);
            startActivity(i);
        });
        b.recyclerView.setLayoutManager(new LinearLayoutManager(this));
        b.recyclerView.setAdapter(adapter);

        b.swipeRefresh.setOnRefreshListener(this::loadOrders);
        b.btnNewOrder.setOnClickListener(v -> startActivity(new Intent(this, CreateOrderActivity.class)));
        b.tvLogout.setOnClickListener(v -> {
            FirebaseUtil.auth().signOut();
            startActivity(new Intent(this, LoginActivity.class));
            finish();
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        loadOrders();
    }

    private void loadOrders() {
        String uid = FirebaseUtil.currentUid();
        if (uid == null) return;

        b.swipeRefresh.setRefreshing(true);
        FirebaseUtil.db().collection(FirebaseUtil.COL_ORDERS)
                .whereEqualTo("clientId", uid)
                .orderBy("createdAt", Query.Direction.DESCENDING)
                .get()
                .addOnSuccessListener(this::onOrdersLoaded)
                .addOnFailureListener(e -> {
                    b.swipeRefresh.setRefreshing(false);
                    Toast.makeText(this, "خطأ في جلب الطلبات: " + e.getMessage(), Toast.LENGTH_LONG).show();
                });
    }

    private void onOrdersLoaded(QuerySnapshot snapshot) {
        b.swipeRefresh.setRefreshing(false);
        List<Order> orders = new ArrayList<>();
        for (var doc : snapshot.getDocuments()) {
            Order o = doc.toObject(Order.class);
            o.id = doc.getId();
            orders.add(o);
        }
        adapter.setItems(orders);
        b.tvEmpty.setVisibility(orders.isEmpty() ? View.VISIBLE : View.GONE);
    }
}
