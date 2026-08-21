package com.tawsil.app;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import com.google.firebase.firestore.QuerySnapshot;
import com.tawsil.app.databinding.ActivityAdminHomeBinding;
import java.util.ArrayList;
import java.util.List;

public class AdminHomeActivity extends AppCompatActivity {

    private ActivityAdminHomeBinding b;
    private OrderAdapter orderAdapter;
    private UserAdapter userAdapter;
    private boolean showingOrders = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        b = ActivityAdminHomeBinding.inflate(getLayoutInflater());
        setContentView(b.getRoot());

        orderAdapter = new OrderAdapter(order -> {
            Intent i = new Intent(this, OrderDetailActivity.class);
            i.putExtra("order", order);
            startActivity(i);
        });
        userAdapter = new UserAdapter();

        b.recyclerView.setLayoutManager(new LinearLayoutManager(this));
        b.recyclerView.setAdapter(orderAdapter);

        b.swipeRefresh.setOnRefreshListener(this::loadData);
        b.btnTabOrders.setOnClickListener(v -> switchTab(true));
        b.btnTabUsers.setOnClickListener(v -> switchTab(false));
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

    private void switchTab(boolean orders) {
        showingOrders = orders;
        b.btnTabOrders.setBackgroundTintList(getColorStateList(orders ? R.color.primary : R.color.text_gray));
        b.btnTabUsers.setBackgroundTintList(getColorStateList(orders ? R.color.text_gray : R.color.primary));
        b.recyclerView.setAdapter(orders ? orderAdapter : userAdapter);
        loadData();
    }

    private void loadData() {
        b.swipeRefresh.setRefreshing(true);
        if (showingOrders) {
            FirebaseUtil.db().collection(FirebaseUtil.COL_ORDERS).get()
                    .addOnSuccessListener(this::onOrdersLoaded)
                    .addOnFailureListener(this::onError);
        } else {
            FirebaseUtil.db().collection(FirebaseUtil.COL_USERS).get()
                    .addOnSuccessListener(this::onUsersLoaded)
                    .addOnFailureListener(this::onError);
        }
    }

    private void onOrdersLoaded(QuerySnapshot snapshot) {
        b.swipeRefresh.setRefreshing(false);
        List<Order> orders = new ArrayList<>();
        for (var doc : snapshot.getDocuments()) {
            Order o = doc.toObject(Order.class);
            o.id = doc.getId();
            orders.add(o);
        }
        orders.sort((a, c) -> Long.compare(c.createdAt, a.createdAt));
        orderAdapter.setItems(orders);
        b.tvOrdersCount.setText(orders.size() + " طلب");
    }

    private void onUsersLoaded(QuerySnapshot snapshot) {
        b.swipeRefresh.setRefreshing(false);
        List<User> users = new ArrayList<>();
        for (var doc : snapshot.getDocuments()) {
            users.add(doc.toObject(User.class));
        }
        userAdapter.setItems(users);
        b.tvUsersCount.setText(users.size() + " مستخدمين");
    }

    private void onError(Exception e) {
        b.swipeRefresh.setRefreshing(false);
        Toast.makeText(this, "خطأ: " + e.getMessage(), Toast.LENGTH_LONG).show();
    }
}
